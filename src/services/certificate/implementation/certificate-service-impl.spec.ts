import { CsHttpService, CsResponse } from '../../../core/http-service/interface';
import { Container } from 'inversify';
import { InjectionTokens } from '../../../injection-tokens';
import { CsCertificateService, CertificateType } from '../interface';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    const mockApiPathLegacy = 'MOCK_PATH_LEGACY';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH).toConstantValue(mockApiPath);
        container.bind<string>(InjectionTokens.services.certificate.RC_API_PATH).toConstantValue(mockRCApiPath);
        container.bind<string>(InjectionTokens.services.certificate.CERTIFICATE_SERVICE_API_PATH_LEGACY).toConstantValue(mockApiPathLegacy);
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

    describe('fetchCertificates()', () => {
        it('should merge the responses from v1 and rc then return the response if statuscode is 200', (done) => {

            mockHttpService.fetch = jest.fn((request) => {
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return of(response);
                } else if (request.path.includes("/certs/search")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                content: [{
                                    _index: 1,
                                    _type: '',
                                    _id: '',
                                    _score: 1,
                                    _source: {
                                        pdfUrl: 'SAMPLE_PDF_URL',
                                        data: {
                                            badge: {
                                                name: 'SAMPLE_NAME',
                                                issuer: {
                                                    name: 'SAMPLE_ISSUER'
                                                }
                                            },
                                            issuedOn: ''
                                        },
                                        related: {
                                            courseId: '',
                                            Id: ''
                                        }
                                    }
                                }]
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = [{
                        training: {
                            osid: '',
                            name: 'SAMPLE_NAME_RC',
                            id: '',
                            batchId: '',
                            type: ''
                        },
                        certificateLabel: '',
                        signatory: [],
                        recipient: {
                            osid: '',
                            name: '',
                            id: '',
                            type: ''
                        },
                        issuer: {
                            osid: '',
                            name: 'SAMPLE_ISSUER_RC',
                            url: ''
                        },
                        osid: '',
                        status: ''
                    }]
                    return of(response);
                }

            });

            certificateService.fetchCertificates({
                userId: 'SAMPLE_USER_ID',
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(1, expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('MOCK_API_PATH/certs/search')
                }));
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(3, expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('MOCK_RC_API_PATH/SOME_SCHEMA_NAME/v1/search')
                }));
                expect(r[0].trainingName).toEqual('SAMPLE_NAME');
                expect(r[1].trainingName).toEqual('SAMPLE_NAME_RC');
                expect(r[0].type).toEqual(CertificateType.CERTIFICATE_REGISTRY);
                expect(r[1].type).toEqual(CertificateType.RC_CERTIFICATE_REGISTRY);
                expect(r.length).toEqual(2);
                done();
            });
        });

        it('should merge the responses from v1 and rc then return the response  when configuration is overridden', (done) => {
            mockHttpService.fetch = jest.fn((request) => {
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return of(response);
                } else if (request.path.includes("/certs/search")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                content: [{
                                    _index: 1,
                                    _type: '',
                                    _id: '',
                                    _score: 1,
                                    _source: {
                                        pdfUrl: 'SAMPLE_PDF_URL',
                                        data: {
                                            badge: {
                                                name: 'SAMPLE_NAME',
                                                issuer: {
                                                    name: 'SAMPLE_ISSUER'
                                                }
                                            },
                                            issuedOn: ''
                                        },
                                        related: {
                                            courseId: '',
                                            Id: ''
                                        }
                                    }
                                }]
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = [{
                        training: {
                            osid: '',
                            name: 'SAMPLE_NAME_RC',
                            id: '',
                            batchId: '',
                            type: ''
                        },
                        certificateLabel: '',
                        signatory: [],
                        recipient: {
                            osid: '',
                            name: '',
                            id: '',
                            type: ''
                        },
                        issuer: {
                            osid: '',
                            name: 'SAMPLE_ISSUER_RC',
                            url: ''
                        },
                        osid: '',
                        status: ''
                    }]
                    return of(response);
                }

            });

            certificateService.fetchCertificates({
                userId: 'SAMPLE_USER_ID',
            }, {
                apiPath: 'SOME_API_PATH',
                rcApiPath: 'SOME_RC_API_PATH/${schemaName}/v1'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(1, expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('SOME_API_PATH/certs/search')
                }));
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(3, expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('SOME_RC_API_PATH/SOME_SCHEMA_NAME/v1/search')
                }));
                expect(r[0].trainingName).toEqual('SAMPLE_NAME');
                expect(r[1].trainingName).toEqual('SAMPLE_NAME_RC');
                expect(r.length).toEqual(2);
                done();
            });
        });

        it('should throw error if system settings return error', (done) => {
            mockHttpService.fetch = jest.fn((request) => {
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return throwError(response);
                } else if (request.path.includes("/certs/search")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                content: [{
                                    _index: 1,
                                    _type: '',
                                    _id: '',
                                    _score: 1,
                                    _source: {
                                        pdfUrl: 'SAMPLE_PDF_URL',
                                        data: {
                                            badge: {
                                                name: 'SAMPLE_NAME',
                                                issuer: {
                                                    name: 'SAMPLE_ISSUER'
                                                }
                                            },
                                            issuedOn: ''
                                        },
                                        related: {
                                            courseId: '',
                                            Id: ''
                                        }
                                    }
                                }]
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = [{
                        training: {
                            osid: '',
                            name: 'SAMPLE_NAME_RC',
                            id: '',
                            batchId: '',
                            type: ''
                        },
                        certificateLabel: '',
                        signatory: [],
                        recipient: {
                            osid: '',
                            name: '',
                            id: '',
                            type: ''
                        },
                        issuer: {
                            osid: '',
                            name: 'SAMPLE_ISSUER_RC',
                            url: ''
                        },
                        osid: '',
                        status: ''
                    }]
                    return of(response);
                }

            });

            certificateService.fetchCertificates({
                userId: 'SAMPLE_USER_ID',
                size: 10
            }, {
                apiPath: 'SOME_API_PATH',
                rcApiPath: 'SOME_RC_API_PATH/${schemaName}/v1'
            }).toPromise().catch(() => {
                done()
            })
        });
    });

    describe('getPublicKey()', () => {
        it('should throw error if schemaName is empty and system settings also not configured', (done) => {

            mockHttpService.fetch = jest.fn((request) => {
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return throwError("Test");
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        osid: 'SOME_KEY',
                        value: 'PUBLIC_KEY',
                        alg: 'RSA',
                        osOwner: []
                    };
                    return of(response);
                }

            });

            certificateService.getPublicKey({
                osid: "SOME_ID",
            }).toPromise().catch((e) => {
                done();
            })
        });

        it('should be able to get the publickey if response code is 200', (done) => {
            mockHttpService.fetch = jest.fn((request) => {
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        osid: 'SOME_KEY',
                        value: 'PUBLIC_KEY',
                        alg: 'RSA',
                        osOwner: []
                    };
                    return of(response);
                }

            });

            certificateService.getPublicKey({
                osid: "SOME_KEY",
                alg: 'RSA'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(2, expect.objectContaining({
                    type: 'GET',
                    path: expect.stringContaining('MOCK_RC_API_PATH/SOME_SCHEMA_NAME/v1/key/SOME_KEY')
                }));
                expect(r).toEqual(
                    {
                        osid: 'SOME_KEY',
                        value: 'PUBLIC_KEY',
                        alg: 'RSA',
                        osOwner: []
                    }
                );
                done();
            });
        });

        it('should be able to get the publickey when configuration is overridden', (done) => {
            mockHttpService.fetch = jest.fn((request) => {
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return of(response);
                } else {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        osid: 'SOME_KEY',
                        value: 'PUBLIC_KEY',
                        alg: 'RSA',
                        osOwner: []
                    };
                    return of(response);
                }

            });

            certificateService.getPublicKey({
                osid: "SOME_KEY",
                alg: 'RSA'
            }, {
                apiPath: '/some_path',
                rcApiPath: '/path/${schemaName}'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(2, expect.objectContaining({
                    type: 'GET',
                    path: expect.stringContaining('/path/SOME_SCHEMA_NAME/key/SOME_KEY')
                }));
                expect(r).toEqual(
                    {
                        osid: 'SOME_KEY',
                        value: 'PUBLIC_KEY',
                        alg: 'RSA',
                        osOwner: []
                    }
                );
                done();
            });
        });
    });

    describe('getCerificateDownloadURI()', () => {

        it('should throw error if schemaName is empty and system settings also not configured', (done) => {

            mockHttpService.fetch = jest.fn((request) => {
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
                            }
                        }
                    };
                    return throwError("Test");
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
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
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
                    path: expect.stringContaining('MOCK_API_PATH/certs/download/SOME_ID')
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
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
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
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
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
                rcApiPath: '/api/rc/${schemaName}/v1'
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
                if (request.path.includes("/system/settings/")) {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: {
                                value: "SOME_SCHEMA_NAME"
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
                rcApiPath: '/api/rc/${schemaName}/v1'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenNthCalledWith(1, expect.objectContaining({
                    type: 'GET',
                    path: expect.stringContaining('/some_path/certs/download/SOME_ID')
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

    describe('getLegacyCerificateDownloadURI()', () => {

        it('should be able to get the signed URL if response code is 200', (done) => {

            mockHttpService.fetch = jest.fn((request) => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        signedUrl: 'SAMPLE_SIGNED_URL'
                    }
                };
                return of(response);

            });

            certificateService.getLegacyCerificateDownloadURI({
                pdfUrl: "SAMPLE_PDF_URL",
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('MOCK_PATH_LEGACY/certs/download')
                }));
                expect(r).toEqual(
                    {
                        signedUrl: "SAMPLE_SIGNED_URL"
                    }
                );
                done();
            });
        });

        it('should be able to get the signed URL when configuration is overridden', (done) => {
            mockHttpService.fetch = jest.fn((request) => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        signedUrl: 'SAMPLE_SIGNED_URL'
                    }
                };
                return of(response);

            });

            certificateService.getLegacyCerificateDownloadURI({
                pdfUrl: "SAMPLE_PDF_URL",
            }, {
                apiPath: '/some_path',
                rcApiPath: '/api/rc/${schemaName}/v1',
                apiPathLegacy: '/some_legacy_path'
            }).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('/some_legacy_path/certs/download')
                }));
                expect(r).toEqual(
                    {
                        signedUrl: 'SAMPLE_SIGNED_URL'
                    }
                );
                done();
            });
        });
    });

});
