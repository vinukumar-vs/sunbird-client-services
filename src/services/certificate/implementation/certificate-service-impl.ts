import { Container, inject, injectable } from "inversify";
import { Observable, of } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { CsCertificateServiceConfig } from "src";
import { CsHttpRequestType, CsHttpService, CsRequest } from "src/core/http-service";
import { InjectionTokens } from "src/injection-tokens";
import { LearnerCertificate, LearnerCertificateV1, LearnerCertificateV2 } from "src/models";
import { CsCertificateService, CSGetLearnerCerificateRequest } from "..";

@injectable()
export class CertificateServiceImpl implements CsCertificateService {
  constructor(
    @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
    @inject(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH) private apiPath: string,
    @inject(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_RC_API_PATH) private rcCertApiPath: string,
    @inject(InjectionTokens.CONTAINER) private container: Container
  ) {
  }

    fetchCertificatesV1(request: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<LearnerCertificateV1[]> {
        if (!this.apiPath && (!config || !config.apiPath)) {
            throw new Error('Required certificate api Path configuration');
        }

        let certRequest = {
            ...(request.size ? { size: request.size } : null),
            _source: [
              'data.badge.issuer.name',
              'pdfUrl',
              'data.issuedOn',
              'data.badge.name',
              'related.courseId',
              'related.Id'
            ],
            query: {
              bool: {
                must: [
                  {
                    match_phrase: {
                      'recipient.id': request.userId
                    }
                  }
                ]
              }
            }
          };

        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/certs/search`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: certRequest
            })
            .build();

        return this.httpService.fetch<{ result: { response: { count: number, content: LearnerCertificateV1[] } } }>(apiRequest)
        .pipe(
            map((response) => {
            return response.body.result.response.content;
            })
        );
    }

    fetchCertificatesV2(request: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<LearnerCertificate[]> {
        if (!this.rcCertApiPath && (!config || !config.rcCertApiPath)) {
            throw new Error('Required certificate api Path configuration');
        }

        let certRequest = {
            filters:{
                contact:{
                    eq: request.userId
                }
            }
        };

        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.rcCertApiPath : this.rcCertApiPath}/search`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: certRequest
            })
            .build();

        return this.httpService.fetch<{ result: LearnerCertificateV2[] }>(apiRequest)
        .pipe(
            map((response) => {
            return response.body.result.map(r => {
                let result = {
                    id: r.training.id,
                    name: r.training.name,
                    issuerName: r.issuer.name,
                }
                return result;
            });
            })
        );
    }

    fetchcertificates(request: CSGetLearnerCerificateRequest): Observable<LearnerCertificate[]> {
        return this.fetchCertificatesV1(request).pipe(
            map((r) => r.map((rs) => {
                let result = {
                    id: rs._id,
                    courseId: rs._source.related.courseId,
                    name: rs._source.data.badge.name,
                    pdfUrl: rs._source.pdfUrl,
                    issuedOn: rs._source.data.issuedOn,
                    issuerName: rs._source.data.badge.issuer.name,
                }
                return result;
            })
            ),
            mergeMap((result) => {
                return this.fetchCertificatesV2(request).pipe(
                    map(r => [...result, ...r])
                )
            })  
        )
    }
  
}