import { Container, inject, injectable } from "inversify";
import { catchError, map, mergeMap } from "rxjs/operators";
import { CsLearnerCertificate, CsLearnerCertificateV1, CsLearnerCertificateV2 } from "../../../models";
import { CSGetLearnerCerificateRequest } from "..";
import { defer, iif, Observable, of } from "rxjs";
import { CsCertificateServiceConfig } from '../../../index';
import { CsHttpRequestType, CsHttpService, CsRequest } from '../../../core/http-service/interface';
import { InjectionTokens } from '../../../injection-tokens';
import {
    CsCertificateService,
    GetPublicKeyRequest,
    GetPublicKeyResponse,
    FetchCertificateResponse,
    FetchCertificateRequest,
    CertificateType,
    GetLegacyCertificateRequest,
    GetLegacyCertificateResponse
} from "../interface";
import { CsSystemSettingsService } from "../../system-settings/interface/";

@injectable()
export class CertificateServiceImpl implements CsCertificateService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH) private apiPath: string,
        @inject(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH_LEGACY) private apiPathLegacy: string,
        @inject(InjectionTokens.services.certificate.RC_API_PATH) private rcApiPath: string,
        @inject(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE) private systemSettingsService: CsSystemSettingsService,
    ) {
    }

    fetchCertificatesV1(request: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificateV1[]> {
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

        return this.httpService.fetch<{ result: { response: { count: number, content: CsLearnerCertificateV1[] } } }>(apiRequest)
            .pipe(
                map((response) => {
                    return response.body.result.response.content;
                }),
                catchError((e) => {
                    console.error(e);
                    return [];
                    
                })
            );
    }

    fetchCertificatesV2(request: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificate[]> {
        return defer(async () => {
            let schemaName = request.schemaName
            if (!schemaName) {
                try {
                    schemaName = await this.systemSettingsService.getSystemSettings("certificate_schema").toPromise();
                } catch (e) {
                    throw new Error('Schema Name Not found');
                }
            }
            let certRequest = {
                filters: {
                    recipient: {
                        id: {
                            eq: request.userId
                        }
                    }
                }
            };

            const apiRequest: CsRequest = new CsRequest.Builder()
                .withType(CsHttpRequestType.POST)
                .withPath((config ? config.rcApiPath : this.rcApiPath).replace("${schemaName}", schemaName) + '/search')
                .withBearerToken(true)
                .withUserToken(true)
                .withBody(certRequest)
                .build();

            return this.httpService.fetch< CsLearnerCertificateV2[] >(apiRequest)
                .pipe(
                    map((response) => {
                        return response.body.map(r => {
                            let result = {
                                id: r.osid,
                                trainingName: r.training.name,
                                issuerName: r.issuer.name,
                                issuedOn: r.issuer.osUpdatedAt,
                                courseId: r.training.id,
                                type: CertificateType.RC_CERTIFICATE_REGISTRY
                            }
                            return result;
                        });
                    }),
                    catchError((e) => {
                        console.error(e);
                        return [];
                        
                    })
                ).toPromise();
        });
    }

    fetchCertificates(request: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificate[]> {
        return this.fetchCertificatesV1(request, config).pipe(
            map((r) => r.map((rs) => {
                let result = {
                    id: rs._id,
                    trainingName: rs._source.data.badge.name,
                    issuerName: rs._source.data? rs._source.data.badge.issuer.name : undefined,
                    issuedOn: rs._source.data ? rs._source.data.issuedOn: undefined,
                    courseId: rs._source.related.courseId,
                    pdfUrl: rs._source.pdfUrl,
                    type: CertificateType.CERTIFICATE_REGISTRY
                }
                return result;
            }),
            ),
        mergeMap((result) => {
            return this.fetchCertificatesV2(request, config).pipe(
                map(r => [...result, ...r])
            )
        })
    )
    }

    getPublicKey(request: GetPublicKeyRequest, config?: CsCertificateServiceConfig): Observable<GetPublicKeyResponse> {
        return defer(async () => {
            let schemaName = request.schemaName
            if (!schemaName) {
                try {
                    schemaName = await this.systemSettingsService.getSystemSettings("certificate_schema").toPromise();
                } catch (e) {
                    throw new Error('Schema Name Not found');
                }
            }

            const apiRequest: CsRequest = new CsRequest.Builder()
                .withType(CsHttpRequestType.GET)
                .withPath((config ? config.rcApiPath : this.rcApiPath).replace("${schemaName}", schemaName) + `/key/${request.osid}`)
                .withBearerToken(true)
                .withUserToken(true)
                .withBody({ request })
                .build();

            return this.httpService.fetch<GetPublicKeyResponse>(apiRequest)
                .pipe(
                    map((response) => {
                        return response.body;
                    })
                ).toPromise();
        });
    }

    getCerificateDownloadURI(request: FetchCertificateRequest, config?: CsCertificateServiceConfig): Observable<FetchCertificateResponse> {
        return iif(
            () => (request.type === CertificateType.RC_CERTIFICATE_REGISTRY),
            defer(async () => {
                let schemaName = request.schemaName
                if (!schemaName) {
                    try {
                        schemaName = await this.systemSettingsService.getSystemSettings("certificate_schema").toPromise();
                    } catch (e) {
                        throw new Error('Schema Name Not found');
                    }
                }
                const rcRequest: CsRequest = new CsRequest.Builder()
                    .withType(CsHttpRequestType.GET)
                    .withPath((config ? config.rcApiPath : this.rcApiPath)!!.replace("${schemaName}", schemaName) + '/download/' + request.certificateId)
                    .withBearerToken(true)
                    .withHeaders({
                        'Accept': "image/svg+xml"
                    })
                    .build();
                return this.httpService.fetch<string>(rcRequest).pipe(
                    map((response) => {
                        return {
                            printUri: response.body
                        };
                    })
                ).toPromise();
            }),
            defer(() => {
                const registryCertficateRequest: CsRequest = new CsRequest.Builder()
                    .withType(CsHttpRequestType.GET)
                    .withPath((config ? config.apiPath : this.apiPath) + '/certs/download/' + request.certificateId)
                    .withBearerToken(true)
                    .withUserToken(true)
                    .build();
                return this.httpService.fetch<{ result: { printUri: string } }>(registryCertficateRequest).pipe(
                    map((response) => {
                        return response.body.result;
                    })
                );
            })
        );
    }

    getLegacyCerificateDownloadURI(req: GetLegacyCertificateRequest, config?: CsCertificateServiceConfig): Observable<GetLegacyCertificateResponse> {
        const signCertificateRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPathLegacy : this.apiPathLegacy}/certs/download`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({ request: req })
            .build();

        return this.httpService.fetch<{ result: GetLegacyCertificateResponse }>(signCertificateRequest).pipe(
            map((response) => {
                return response.body.result;
            })
        );
    }

}