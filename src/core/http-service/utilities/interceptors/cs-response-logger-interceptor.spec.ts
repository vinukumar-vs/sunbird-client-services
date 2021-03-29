import {CsResponseLoggerInterceptor} from './cs-response-logger-Interceptor';
import {CsHttpRequestType, CsRequest, CsResponse} from '../../interface';

describe('CsRequestLoggerInterceptor', () => {
    let csResponseLoggerInterceptor: CsResponseLoggerInterceptor;

    beforeAll(() => {
        csResponseLoggerInterceptor = new CsResponseLoggerInterceptor();
    });

    it('should be able to create an instance', () => {
        expect(csResponseLoggerInterceptor).toBeTruthy();
    });

    describe('interceptRequest()', () => {
        it('should log the request in the console and forward the request', (done) => {
            const apiRequest = new CsRequest.Builder()
                .withType(CsHttpRequestType.POST)
                .withPath(`/list`)
                .withBearerToken(true)
                .withUserToken(true)
                .withBody({})
                .build();
            const apiResponse = new CsResponse();
            csResponseLoggerInterceptor.interceptResponse(apiRequest, apiResponse).subscribe((r) => {
                expect(r).toEqual(apiResponse);
                done();
            });
        });
    });
});
