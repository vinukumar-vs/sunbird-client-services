import { CsHttpService, CsResponse } from '../../../core/http-service/interface';
import { Container } from 'inversify';
import { InjectionTokens } from '../../../injection-tokens';
import { CsCertificateService, CertificateType } from '../interface';
import { of, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { CertificateServiceImpl } from './certificate-service-impl';
import { CsSystemSettingsService } from '../../system-settings/interface';
import { SystemSettingsServiceImpl } from '../../system-settings/implementation/system-settings-service-impl';

describe('CertificateServiceImpl', () => {
    let certificateService: CsCertificateService;
    let systemSettingsService: CsSystemSettingsService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockSystemSettingsService: Partial<CsSystemSettingsService> = {};
    const mockApiPath = 'MOCK_API_PATH';
    const mockRCApiPath = 'MOCK_RC_API_PATH/${schemaName}/v1';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH).toConstantValue(mockApiPath);
        container.bind<string>(InjectionTokens.services.certificate.RC_API_PATH).toConstantValue(mockRCApiPath);
        container.bind<CsCertificateService>(InjectionTokens.services.certificate.CERTIFICATE_SERVICE).to(CertificateServiceImpl).inSingletonScope();
        container.bind<CsSystemSettingsService>(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE).to(SystemSettingsServiceImpl).inSingletonScope();
        container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(container);

        certificateService = container.get<CsCertificateService>(InjectionTokens.services.certificate.CERTIFICATE_SERVICE);
        systemSettingsService = container.get<CsSystemSettingsService>(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(certificateService).toBeTruthy();
    });

    describe('getPublicKey()', () => {
        it('should be able to get the publickey if response code is 200', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        SigningKey: {
                            osid: 'SOME_KEY'
                        }
                    }
                };
                return of(response);
            });

            certificateService.getPublicKey({
                signingKey: "SOME_KEY",
                algorithim: 'RSA'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('MOCK_API_PATH/SOME_KEY')
                }));
                expect(r).toEqual(
                    {
                        osid: 'SOME_KEY'
                    }
                );
                done();
            });
        });

        it('should be able to get the publickey when configuration is overridden', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        SigningKey: {
                            osid: 'SOME_KEY'
                        }
                    }
                };
                return of(response);
            });

            certificateService.getPublicKey({
                signingKey: "SOME_KEY",
                algorithim: 'RSA'
            }, {
                apiPath: '/some_path'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('/some_path')
                }));
                expect(r).toEqual(
                    {
                        osid: 'SOME_KEY'
                    }
                );
                done();
            });
        });
    });

    describe('getCerificateDownloadURI()', () => {

        it('should throw error if schemaName is empty and system settings also not configured', (done) => {

            mockHttpService.fetch = jest.fn((request) => {
                if(request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value : "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return  throwError("Test");
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            printUri: 'SAMPLE_PRINT_URI'
                        }
                    };
                    return of(response);
                }
            
            });
        
            certificateService.getCerificateDownloadURI({
                certificateId: "SOME_ID",
                type: CertificateType.RC_CERTIFICATE_REGISTRY
            }).toPromise().catch((e) => {                
                done();
            })
        });
        
        it('should be able to get the download if response code is 200', (done) => {

            mockHttpService.fetch = jest.fn((request) => {
                if(request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value : "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            printUri: 'SAMPLE_PRINT_URI'
                        }
                    };
                    return of(response);
                }
            
            });

            certificateService.getCerificateDownloadURI({
                certificateId: "SOME_ID",
                type: CertificateType.CERTIFICATE_REGISTRY
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                    path: expect.stringContaining('MOCK_API_PATH/download/SOME_ID')
                }));
                expect(r).toEqual(
                    {
                        printUri: "SAMPLE_PRINT_URI"
                    }
                );
                done();
            });
        });

        it('should be able to get the downloadUrl for RC if response code is 200', (done) => {
            mockHttpService.fetch = jest.fn((request) => {
                if(request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value : "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = "SOME_STRING";
                    return of(response);
                }
            
            });
            mockSystemSettingsService.getSystemSettings = jest.fn(() => {
                return of("SOME_SCHEMA_NAME");
            });

            certificateService.getCerificateDownloadURI({
                certificateId: "SOME_ID",
                type: CertificateType.RC_CERTIFICATE_REGISTRY
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(2, expect.objectContaining({
                    type: 'GET',
                    path: expect.stringContaining('MOCK_RC_API_PATH/SOME_SCHEMA_NAME/v1/download/SOME_ID')
                }));
                expect(r).toEqual(
                    {
                        printUri: "SOME_STRING"
                    }
                );
                done();
            });
        });

        it('should be able to get the downloadUrl for RC when configuration is overridden', (done) => {
            mockHttpService.fetch = jest.fn((request) => {
                if(request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value : "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = "SOME_STRING";
                    return of(response);
                }
            
            });
            mockSystemSettingsService.getSystemSettings = jest.fn(() => {
                return of("SOME_SCHEMA_NAME");
            });

            certificateService.getCerificateDownloadURI({
                certificateId: "SOME_ID",
                type: CertificateType.RC_CERTIFICATE_REGISTRY
            }, {
                apiPath: '/some_path',
                rcApiPath:'/api/rc/${schemaName}/v1'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(2, expect.objectContaining({
                    type: 'GET',
                    path: expect.stringContaining('/api/rc/SOME_SCHEMA_NAME/v1/download/SOME_ID')
                }));
                expect(r).toEqual(
                    {
                        printUri: "SOME_STRING"
                    }
                );
                done();
            });
        });

        it('should be able to get the downloadUrl for Certifcate Registry when configuration is overridden', (done) => {
            mockHttpService.fetch = jest.fn((request) => {
                if(request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value : "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            printUri: 'SAMPLE_PRINT_URI'
                        }
                    };
                    return of(response);
                }
            
            });
            mockSystemSettingsService.getSystemSettings = jest.fn(() => {
                return of("SOME_SCHEMA_NAME");
            });

            certificateService.getCerificateDownloadURI({
                certificateId: "SOME_ID",
                type: CertificateType.CERTIFICATE_REGISTRY
            }, {
                apiPath: '/some_path',
                rcApiPath:'/api/rc/${schemaName}/v1'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(1, expect.objectContaining({
                    type: 'GET',
                    path: expect.stringContaining('/some_path/download/SOME_ID')
                }));
                expect(r).toEqual(
                    {
                        printUri: "SAMPLE_PRINT_URI"
                    }
                );
                done();
            });
        });
    });


});
