import {CsHttpRequestType, CsHttpSerializer, CsRequest} from '../interface/cs-request';
import {CsResponse, CsHttpResponseCode} from '../interface/cs-response';
import {from, Observable} from 'rxjs';
import {Container, inject, injectable} from 'inversify';
import * as qs from 'qs';
import {CsHttpService} from '../interface/cs-http-service';
import {InjectionTokens} from '../../../index';
import {HttpClient} from './http-client-adapters/http-client';
import {BearerTokenInjectRequestInterceptor} from './interceptors/bearer-token-inject-request-interceptor';
import {UserTokenRequestInterceptor} from './interceptors/user-token-request-interceptor';

@injectable()
export class HttpServiceImpl implements CsHttpService {
    private static async interceptRequest(request: CsRequest): Promise<CsRequest> {
        const interceptors = request.requestInterceptors;
        for (const interceptor of interceptors) {
            request = await interceptor.interceptRequest(request).toPromise();
        }

        return request;
    }

    private static async interceptResponse(request: CsRequest, response: CsResponse): Promise<CsResponse> {
        const interceptors = request.responseInterceptors;
        for (const interceptor of interceptors) {
            response = await interceptor.interceptResponse(request, response).toPromise();
        }

        if (response.responseCode !== CsHttpResponseCode.HTTP_SUCCESS) {
            throw response;
        }

        return response;
    }

    constructor(
        @inject(InjectionTokens.CONTAINER) private container: Container,
        @inject(InjectionTokens.core.HTTP_ADAPTER) private http: HttpClient,
        @inject(InjectionTokens.core.api.HOST) private readonly host: string,
        @inject(InjectionTokens.core.global.headers.CHANNEL_ID) private readonly channelId: string,
        @inject(InjectionTokens.core.global.headers.DEVICE_ID) private readonly deviceId: string,
        @inject(InjectionTokens.core.global.headers.PRODUCER_ID) private readonly producerId: string,
    ) {
    }

    public fetch<T = any>(request: CsRequest): Observable<CsResponse<T>> {
        this.addGlobalHeader();

        this.buildInterceptorsFromAuthenticators(request);

        let response = (async () => {
            request = await HttpServiceImpl.interceptRequest(request);

            switch (request.type) {
                case CsHttpRequestType.GET:
                    response = await this.http.get(
                        request.host || this.host, request.path, request.headers, request.parameters
                    ).toPromise();
                    break;
                case CsHttpRequestType.PATCH:
                    response = await this.http.patch(
                        request.host || this.host, request.path, request.headers, request.body
                    ).toPromise();
                    break;
                case CsHttpRequestType.POST: {
                    response = await this.http.post(
                        request.host || this.host, request.path, request.headers, request.body
                    ).toPromise();
                    break;
                }
            }

            response = await HttpServiceImpl.interceptResponse(request, response);
            return response;
        })();

        return from(response as Promise<CsResponse<T>>);
    }

    protected addGlobalHeader() {
        const header = {
            'X-Channel-Id': this.channelId,
            'X-App-Id': this.producerId,
            'X-Device-Id': this.deviceId,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        };
        this.http.addHeaders(header);
    }

    private buildInterceptorsFromAuthenticators(request: CsRequest) {
        if (request.withBearerToken) {
            request.requestInterceptors.push(new BearerTokenInjectRequestInterceptor(this.container));
        }

        if (request.withUserToken) {
            request.requestInterceptors.push(new UserTokenRequestInterceptor(this.container));
        }

        if (this.http.setSerializer(request.serializer) === CsHttpSerializer.URLENCODED) {
            request.body = qs.stringify(request.body);
        }

        this.http.setSerializer(request.serializer);
    }
}
