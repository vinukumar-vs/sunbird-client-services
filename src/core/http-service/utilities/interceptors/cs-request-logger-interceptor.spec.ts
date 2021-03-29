import {CsRequestLoggerInterceptor} from './cs-request-logger-interceptor';
import {CsHttpRequestType, CsRequest} from '../../interface';

describe('CsRequestLoggerInterceptor', () => {
    let csRequestLoggerInterceptor: CsRequestLoggerInterceptor;

    beforeAll(() => {
        csRequestLoggerInterceptor = new CsRequestLoggerInterceptor();
    });

    it('should be able to create an instance', () => {
        expect(csRequestLoggerInterceptor).toBeTruthy();
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
            csRequestLoggerInterceptor.interceptRequest(apiRequest).subscribe((r) => {
                expect(r).toEqual(apiRequest);
                done();
            });
        });
    });
});
