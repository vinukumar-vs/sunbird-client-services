import {HttpClientCordovaAdapter} from './http-client-cordova-adapter';
import {CsHttpResponseCode, CsHttpSerializer} from '../../interface';
import {CsHttpClientError, CsHttpServerError, CsNetworkError} from '../../errors';
import {HttpClient} from './http-client';

describe('HttpClientCordovaAdapter', () => {
    let httpClientCordovaAdapter: HttpClient;

    const mockCordovaPlugin = {};
    window['cordova'] = {
        plugin: {
            http: mockCordovaPlugin
        }
    };

    beforeAll(() => {
        httpClientCordovaAdapter = new HttpClientCordovaAdapter();
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to create an instance', () => {
        expect(httpClientCordovaAdapter).toBeTruthy();
    });

    describe('setSerializer()', () => {
        it('should delegate to cordova http plugin', () => {
            // arrange
            mockCordovaPlugin['setDataSerializer'] = jest.fn(() => {
            });

            // act
            httpClientCordovaAdapter.setSerializer(CsHttpSerializer.JSON);

            // assert
            expect(mockCordovaPlugin['setDataSerializer']).toHaveBeenCalledWith(CsHttpSerializer.JSON);
        });
    });

    describe('addHeaders()', () => {
        it('should delegate to cordova http plugin', () => {
            // arrange
            mockCordovaPlugin['setHeader'] = jest.fn(() => {
            });

            // act
            httpClientCordovaAdapter.addHeaders({'KEY': 'VALUE', 'KEY1': 'VALUE1', 'KEY2': 'VALUE2'});

            // assert
            expect(mockCordovaPlugin['setHeader']).toHaveBeenNthCalledWith(1, '*', 'KEY', 'VALUE');
            expect(mockCordovaPlugin['setHeader']).toHaveBeenNthCalledWith(2, '*', 'KEY1', 'VALUE1');
            expect(mockCordovaPlugin['setHeader']).toHaveBeenNthCalledWith(3, '*', 'KEY2', 'VALUE2');
        });
    });

    describe('addHeader()', () => {
        it('should delegate to cordova http plugin', () => {
            // arrange
            mockCordovaPlugin['setHeader'] = jest.fn(() => {
            });

            // act
            httpClientCordovaAdapter.addHeader('KEY', 'VALUE');

            // assert
            expect(mockCordovaPlugin['setHeader']).toHaveBeenCalledWith('*', 'KEY', 'VALUE');
        });
    });

    describe('addHeader()', () => {
        it('should delegate to cordova http plugin', () => {
            // arrange
            mockCordovaPlugin['setHeader'] = jest.fn(() => {
            });

            // act
            httpClientCordovaAdapter.addHeader('KEY', 'VALUE');

            // assert
            expect(mockCordovaPlugin['setHeader']).toHaveBeenCalledWith('*', 'KEY', 'VALUE');
        });
    });

    describe('get, post, patch, delete', () => {
        describe('on success response', () => {
            describe('when response is JSON', () => {
                it('should resolve with success response', (done) => {
                    // arrange
                    mockCordovaPlugin['sendRequest'] = jest.fn((_, __, successCallback, errorCallback) => {
                        setTimeout(() => {
                            successCallback({
                                data: {'SOME_KEY': 'SOME_VALUE'},
                                status: CsHttpResponseCode.HTTP_SUCCESS
                            });
                        });
                    });

                    httpClientCordovaAdapter.get('http://some_base_url', '/some_path', {'KEY': 'VALUE'}, {'KEY': 'VALUE'}, expect.anything()).subscribe((r) => {
                        expect(r.responseCode).toBe(CsHttpResponseCode.HTTP_SUCCESS);
                        expect(typeof r.body === 'object').toBeTruthy();
                        done();
                    });
                });
            });

            describe('when response is not JSON', () => {
                it('should resolve with success response with string response', (done) => {
                    // arrange
                    mockCordovaPlugin['sendRequest'] = jest.fn((_, __, successCallback, errorCallback) => {
                        setTimeout(() => {
                            successCallback({
                                data: 'SOME_SUCCESS_RESPONSE',
                                status: CsHttpResponseCode.HTTP_SUCCESS
                            });
                        });
                    });

                    httpClientCordovaAdapter.post('http://some_base_url', '/some_path', {'KEY': 'VALUE'}, {'KEY': 'VALUE'}, expect.anything()).subscribe((r) => {
                        expect(typeof r.body === 'string').toBeTruthy();
                        done();
                    });
                });
            });
        });

        describe('on error response', () => {
            describe('when response has 0 status code and not from server', () => {
                it('should throw network error', (done) => {
                    // arrange
                    mockCordovaPlugin['sendRequest'] = jest.fn((_, __, successCallback, errorCallback) => {
                        setTimeout(() => {
                            errorCallback({
                                status: 0
                            });
                        });
                    });

                    httpClientCordovaAdapter.patch('http://some_base_url', '/some_path', {'KEY': 'VALUE'}, {'KEY': 'VALUE'}, expect.anything()).subscribe((r) => {
                        fail();
                    }, (e) => {
                        expect(CsNetworkError.isInstance(e)).toBeTruthy();
                        done();
                    });
                });
            });

            describe('when response is from server', () => {
                describe('when response is JSON', () => {
                    it('should reject with error response', (done) => {
                        // arrange
                        mockCordovaPlugin['sendRequest'] = jest.fn((_, __, successCallback, errorCallback) => {
                            setTimeout(() => {
                                errorCallback({
                                    error: {'SOME_KEY': 'SOME_VALUE'},
                                    status: CsHttpResponseCode.HTTP_BAD_REQUEST
                                });
                            });
                        });

                        httpClientCordovaAdapter.delete('http://some_base_url', '/some_path', {'KEY': 'VALUE'}, {'KEY': 'VALUE'}, expect.anything()).subscribe((r) => {
                            fail();
                        }, (e) => {
                            expect(CsHttpClientError.isInstance(e)).toBeTruthy();
                            expect(typeof (e as CsHttpClientError).response.body).toBe('object');
                            done();
                        });
                    });
                });

                describe('when response is string', () => {
                    it('should reject with error response', (done) => {
                        // arrange
                        mockCordovaPlugin['sendRequest'] = jest.fn((_, __, successCallback, errorCallback) => {
                            setTimeout(() => {
                                errorCallback({
                                    error: 'SOME_ERROR_RESPONSE',
                                    status: CsHttpResponseCode.HTTP_INTERNAL_SERVER_ERROR
                                });
                            });
                        });

                        httpClientCordovaAdapter.delete('http://some_base_url', '/some_path', {'KEY': 'VALUE'}, {'KEY': 'VALUE'}, expect.anything()).subscribe((r) => {
                            fail();
                        }, (e) => {
                            expect(CsHttpServerError.isInstance(e)).toBeTruthy();
                            expect(typeof (e as CsHttpServerError).response.body).toBe('string');
                            done();
                        });
                    });
                });
            });
        });
    });
});
