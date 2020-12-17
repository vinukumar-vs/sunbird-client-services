import { HttpClientBrowserAdapter } from './http-client-browser-adapter';
import { HttpClient } from './http-client';
import { CsHttpResponseCode, CsHttpSerializer } from '../../interface';
import { CsHttpClientError, CsHttpServerError, CsNetworkError } from '../../errors';

describe('HttpClientBrowserAdapter', () => {
    let httpClientBrowserAdapter: HttpClient;

    beforeAll(() => {
        httpClientBrowserAdapter = new HttpClientBrowserAdapter();
    });

    beforeEach(() => {
        httpClientBrowserAdapter['headers'] = {};
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to create an instance', () => {
        expect(httpClientBrowserAdapter).toBeTruthy();
    });

    describe('setSerializer()', () => {
        it('should not fail', () => {
            try {
                httpClientBrowserAdapter.setSerializer(CsHttpSerializer.JSON);
            } catch (e) {
                fail(e);
            }
        });
    });

    describe('addHeaders()', () => {
        it('should not fail', () => {
            try {
                httpClientBrowserAdapter.addHeaders({ 'KEY': 'VALUE', 'KEY1': 'VALUE1', 'KEY2': 'VALUE2' });
            } catch (e) {
                fail(e);
            }
        });
    });

    describe('addHeader()', () => {
        it('should not fail', () => {
            try {
                httpClientBrowserAdapter.addHeader('KEY', 'VALUE');
            } catch (e) {
                fail(e);
            }
        });
    });

    describe('get, post, patch, delete', () => {
        describe('on success response', () => {
            beforeEach(() => {
                httpClientBrowserAdapter['headers'] = {};
                jest.resetAllMocks();
                jest.restoreAllMocks();
            });

            describe('when response is JSON', () => {
                it('should resolve with success response', (done) => {
                    // arrange
                    jest.spyOn(global, 'fetch' as any).mockImplementation(() => Promise.resolve({
                        ok: true,
                        status: CsHttpResponseCode.HTTP_SUCCESS,
                        text: () => Promise.resolve(JSON.stringify({ 'key': 'value' })),
                        headers: new Headers()
                    } as Partial<Response>));

                    httpClientBrowserAdapter.get('https://some_host', '/some_path', {}, { 'KEY': 'VALUE' },
                        expect.anything()).subscribe((r) => {
                            expect(r.responseCode).toBe(CsHttpResponseCode.HTTP_SUCCESS);
                            expect(typeof r.body === 'object').toBeTruthy();
                            expect(r.body).toEqual({ 'key': 'value' });
                            done();
                        });
                });
            });

            describe('when response is not JSON', () => {
                it('should resolve with success response with string response', (done) => {
                    // arrange
                    jest.spyOn(global, 'fetch' as any).mockImplementation(() => Promise.resolve({
                        ok: true,
                        status: CsHttpResponseCode.HTTP_SUCCESS,
                        text: () => Promise.resolve('SOME_SUCCESS_RESPONSE'),
                        headers: new Headers()
                    } as Partial<Response>));

                    httpClientBrowserAdapter.post('https://some_host', '/some_path', {}, { 'KEY': 'VALUE' },
                        expect.anything()).subscribe((r) => {
                            expect(typeof r.body === 'string').toBeTruthy();
                            expect(r.body).toEqual('SOME_SUCCESS_RESPONSE');
                            done();
                        });
                });
            });
        });

        describe('on error response', () => {
            describe('when response is not \'ok\' and not from server', () => {
                it('should throw network error', (done) => {
                    // arrange
                    jest.spyOn(global, 'fetch' as any).mockImplementation(() => Promise.resolve({
                        ok: false,
                        status: 999,
                    } as Partial<Response>));

                    httpClientBrowserAdapter.patch('http://some_base_url', '/some_path', { 'KEY': 'VALUE' }, { 'KEY': 'VALUE' },
                        expect.anything()).subscribe((r) => {
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
                        jest.spyOn(global, 'fetch' as any).mockImplementation(() => Promise.resolve({
                            ok: false,
                            status: CsHttpResponseCode.HTTP_UNAUTHORISED,
                            text: () => Promise.resolve(JSON.stringify({ 'key': 'value' })),
                            headers: new Headers()
                        } as Partial<Response>));

                        httpClientBrowserAdapter.delete('https://run.mocky.io', '/v3/4283da0f-9759-49e6-a045-6b577f73e65f', {}, { 'KEY': 'VALUE' }, expect.anything()).subscribe((r) => {
                            fail();
                        }, (e) => {
                            expect(CsHttpClientError.isInstance(e)).toBeTruthy();
                            expect(typeof (e as CsHttpClientError).response.body).toBe('object');
                            expect((e as CsHttpClientError).response.responseCode).toBe(CsHttpResponseCode.HTTP_UNAUTHORISED);
                            expect((e as CsHttpClientError).response.body).toEqual({ 'key': 'value' });
                            done();
                        });
                    });
                });

                describe('when response is string', () => {
                    it('should reject with error response', (done) => {
                        // arrange
                        jest.spyOn(global, 'fetch' as any).mockImplementation(() => Promise.resolve({
                            ok: false,
                            status: CsHttpResponseCode.HTTP_INTERNAL_SERVER_ERROR,
                            text: () => Promise.resolve(JSON.stringify('SOME_ERROR_RESPONSE')),
                            headers: new Headers()
                        } as Partial<Response>));

                        httpClientBrowserAdapter.delete('http://some_base_url', '/some_path', { 'KEY': 'VALUE' }, { 'KEY': 'VALUE' },
                            expect.anything()).subscribe((r) => {
                                fail();
                            }, (e) => {
                                expect(CsHttpServerError.isInstance(e)).toBeTruthy();
                                expect(typeof (e as CsHttpServerError).response.body).toBe('string');
                                expect((e as CsHttpClientError).response.responseCode).toBe(CsHttpResponseCode.HTTP_INTERNAL_SERVER_ERROR);
                                expect((e as CsHttpClientError).response.body).toEqual('SOME_ERROR_RESPONSE');
                                done();
                            });
                    });
                });
            });
        });
    });
});
