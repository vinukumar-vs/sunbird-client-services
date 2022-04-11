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
    GetLegacyCertificateResponse,
    CsVerifyCertificateRequest,
    CsCertificateDetailsResponse,
    CsGetCertificateRequest,
    CsVerifyCertificateResponse,
    CsLearnerCertificateResponse
} from "../interface";
import { CsSystemSettingsService } from "../../system-settings/interface/";
import { CertificateVerifier } from "../../../utilities/certificate/certificate-verifier";
import JSZip from "jszip";


@injectable()
export class CertificateServiceImpl implements CsCertificateService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH) private apiPath: string,
        @inject(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH_LEGACY) private apiPathLegacy: string,
        @inject(InjectionTokens.services.certificate.RC_API_PATH) private rcApiPath: string,
        @inject(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE) private systemSettingsService: CsSystemSettingsService,
        @inject(InjectionTokens.CONTAINER) private container: Container
    ) {
    }

    fetchCertificatesV1(request: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<{count: number, content: CsLearnerCertificateV1[]}> {
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
                    return response.body.result.response;
                }),
                catchError((e) => {
                    console.error(e);
                    return of({ count: 0, content: [] });
                    
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
                                templateUrl: r.templateUrl,
                                type: CertificateType.RC_CERTIFICATE_REGISTRY
                            }
                            return result;
                        });
                    }),
                    catchError((e) => {
                        console.error(e);
                        return of([]);
                        
                    })
                ).toPromise();
        });
    }

    fetchCertificates(request: CSGetLearnerCerificateRequest, config?: CsCertificateServiceConfig): Observable<CsLearnerCertificateResponse> {
        return this.fetchCertificatesV1(request, config).pipe(
            mergeMap((result) => {
                return this.fetchCertificatesV2(request, config).pipe(
                    map((r) => {
                        const cer = result.content.map((rs) => {
                            return {
                                id: rs._id,
                                trainingName: rs._source.data? rs._source.data.badge.name: undefined,
                                issuerName: rs._source.data? rs._source.data.badge.issuer.name : undefined,
                                issuedOn: rs._source.data ? rs._source.data.issuedOn: undefined,
                                courseId: rs._source.related.courseId,
                                pdfUrl: rs._source.pdfUrl,
                                templateUrl: rs._source.templateUrl,
                                type: CertificateType.CERTIFICATE_REGISTRY 
                            }
                        });
                        const certs = {
                            certRegCount: result.count,
                            rcCount: r.length,
                            certificates: [...cer, ...r]
                        }
                        return certs;
                    })
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
                        'Accept': "image/svg+xml",
                        'template': request.templateUrl
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

    // verifyCertificate(req: CsVerifyCertificateRequest): Promise<any> {
    //     return new CertificateVerifier().getDataFromQr(req)
    // }

    getCertificateDetails(request: CsGetCertificateRequest, config?: CsCertificateServiceConfig): Observable<CsCertificateDetailsResponse> {
        return defer(async () => {
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
                    .withUserToken(true)
                    .build();

            return this.httpService.fetch<CsCertificateDetailsResponse>(rcRequest)
                .pipe(
                    map((response) => {
                        console.log('CsCertificateDetailsResponse csl', response);
                        return response.body;
                    }),
                    catchError((e) => {
                        console.error(e);
                        return of({ status: 'REVOKED' } as CsCertificateDetailsResponse);
                        
                    })
                ).toPromise();
        });
    }

    getEncodedData(encodedData){
        // const zippedData = encodedData;

        const zippedData = atob(encodedData);
        const zip = new JSZip();

        return zip.loadAsync(zippedData).then((contents) => {
            return contents.files['certificate.json'].async('text')
        }).then( (contents) => {
            return JSON.parse(contents);
        }).catch(err => {
            console.log('error', err)
        });
    }

    verifyCertificate(req: CsVerifyCertificateRequest, config?: CsCertificateServiceConfig): Observable<CsVerifyCertificateResponse> {
        return this.getCertificateDetails({ certificateId: req.certificateId, schemaName: req.schemaName }, config)
            .pipe(
                catchError((e) => {
                    console.error(e);
                    // throw e
                    return of({status: 'active'})
                }),
                mergeMap((response: CsCertificateDetailsResponse) => {
                    return iif(
                        () => (!req.publicKey),
                        defer(() => {
                            const certificateData = JSON.parse(response._osSignedData)
                            if (certificateData && certificateData.issuer && certificateData.issuer.publicKey && certificateData.issuer.publicKey.length) {
                                return this.getPublicKey({osid: certificateData.issuer.publicKey, schemaName:req.schemaName}, config)
                                .pipe(
                                    map((response) => {
                                        return response.value;
                                    }),
                                    catchError((e) => {
                                        console.error(e);
                                        throw e
                                    }),
                                )
                            } else {
                                throw new Error('Public Key Not found')
                            }
                        }),
                        defer(() => {
                            return of(req.publicKey)
                        })
                    )
                    .pipe(
                        mergeMap((publicKey) => {
                            return new CertificateVerifier(this.httpService, this.container).verifyData(JSON.parse(response._osSignedData), publicKey).then((data) => {
                                return  {
                                    ...data,
                                    status: response.status 
                                }
                            })
                        })
                    )
                }),
            )
    }

}