import {CsHttpRequestType, CsHttpSerializer, CsRequest} from './cs-request';
import {CsRequestBuilderError} from '../errors';

describe('CsRequest', () => {
    it('should be able to build a request with appropriate attributes', () => {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withHost('gooele.com')
            .withHeaders({'token': 'token'})
            .withType(CsHttpRequestType.GET)
            .withPath('/download/')
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        expect(apiRequest).toBeTruthy();
    });

    it('should not be able to build a request without path', () => {
        try {
            new CsRequest.Builder()
                .withType(CsHttpRequestType.GET)
                .withBearerToken(true)
                .withUserToken(true)
                .build();
        } catch (e) {
            expect(e instanceof CsRequestBuilderError).toBeTruthy();
        }
    });

    it('should not be able to build a request without type', () => {
        try {
            new CsRequest.Builder()
                .withPath('/download/')
                .withBearerToken(true)
                .withUserToken(true)
                .build();
        } catch (e) {
            expect(e instanceof CsRequestBuilderError).toBeTruthy();
        }
    });

    it('should be able to modify some request attributes after building', () => {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withHost('gooele.com')
            .withHeaders({'token': 'token'})
            .withType(CsHttpRequestType.GET)
            .withPath('/download/')
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        apiRequest.serializer = CsHttpSerializer.URLENCODED;
        apiRequest.path = '/SOME_PATH';
        apiRequest.responseInterceptors = [];
        apiRequest.headers = {};
        apiRequest.body = {};
        apiRequest.type = CsHttpRequestType.GET;
        apiRequest.parameters = {};

        expect(apiRequest).toBeTruthy();
    });

    it('should be able to create an instance from a serialised JSON', () => {
        const request = CsRequest.fromJSON({
            type: 'POST',
            path: '/api/content/v1/search',
            withBearerToken: true,
            body: {
                request: {
                    'facets': [
                        'primaryCategory'
                    ],
                    'filters': {
                        'primaryCategory': [
                            'Course'
                        ]
                    }
                }
            }
        } as any);

        expect(request instanceof CsRequest).toBeTruthy();
    });
});
