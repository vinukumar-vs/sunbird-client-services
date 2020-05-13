import {from, Observable} from 'rxjs';
import * as qs from 'qs';
import {HttpClient} from './http-client';
import {CsHttpResponseCode, CsHttpSerializer, CsResponse} from '../../interface';
import {CsHttpClientError, CsHttpServerError, CsNetworkError} from '../../errors';
import {injectable} from 'inversify';

@injectable()
export class HttpClientBrowserAdapter implements HttpClient {
    private headers: { [key: string]: string } = {};
    private serializer?: CsHttpSerializer;

    private static async mapError(url: string, e: any): Promise<CsResponse> {
        if (e instanceof CsHttpServerError || e instanceof CsNetworkError) {
            throw e;
        }

        throw new CsNetworkError(`
            ${url} -
            ${e || ''}
        `);
    }

    private static async mapResponse(response: Response): Promise<CsResponse> {
        const scResponse = new CsResponse<any>();
        scResponse.responseCode = response.status;

        scResponse.body = await response.json();

        if (typeof scResponse.body !== 'object') {
            throw new CsNetworkError(`
                ${response.url} -
                ${scResponse.body || ''}
            `);
        }

        if (response.ok) {
            return scResponse;
        }

        scResponse.errorMesg = 'SERVER_ERROR';

        if (
            response.status === CsHttpResponseCode.HTTP_UNAUTHORISED ||
            response.status === CsHttpResponseCode.HTTP_FORBIDDEN
        ) {
            return scResponse;
        }

        if (response.status >= 400 && response.status <= 499) {
            throw new CsHttpClientError(`
                ${response.url}
            `, scResponse);
        } else {
            throw new CsHttpServerError(`
                ${response.url}
            `, scResponse);
        }
    }

    constructor() {}

    setSerializer(httpSerializer: CsHttpSerializer) {
        this.serializer = httpSerializer;
    }

    addHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    addHeaders(headers: { [p: string]: string }) {
        this.headers = {...this.headers, ...headers};
    }

    get(baseUrl: string, path: string, headers: any, parameters: any): Observable<CsResponse> {
        const url = new URL(baseUrl + path);

        if (typeof parameters === 'object') {
            Object.keys(parameters).forEach((key) => {
                url.searchParams.append(key, parameters[key]);
            });
        }

        return from(
            window.fetch(url.toString(), {
                method: 'GET',
                headers: {...this.headers, ...headers},
            }).then(HttpClientBrowserAdapter.mapResponse)
                .catch((e) => HttpClientBrowserAdapter.mapError(url.toString(), e))
        );
    }

    patch(baseUrl: string, path: string, headers: any, body: any): Observable<CsResponse> {
        const url = new URL(baseUrl + path);

        if (this.serializer === CsHttpSerializer.URLENCODED && typeof body === 'object') {
            this.addHeader('content-type', 'application/x-www-form-urlencoded');
            body = qs.stringify(body);
        } else if (typeof body === 'object') {
            this.addHeader('content-type', 'application/x-www-form-urlencoded');
            body = JSON.stringify(body);
        }

        return from(
            window.fetch(url.toString(), {
                method: 'PATCH',
                headers: {...this.headers, ...headers},
                body
            }).then(HttpClientBrowserAdapter.mapResponse)
                .catch((e) => HttpClientBrowserAdapter.mapError(url.toString(), e))
        );
    }

    post(baseUrl: string, path: string, headers: any, body: any): Observable<CsResponse> {
        const url = new URL(baseUrl + path);

        if (this.serializer === CsHttpSerializer.URLENCODED && typeof body === 'object') {
            this.addHeader('content-type', 'application/x-www-form-urlencoded');
            body = qs.stringify(body);
        } else if (typeof body === 'object') {
            this.addHeader('content-type', 'application/x-www-form-urlencoded');
            body = JSON.stringify(body);
        }

        return from(
            window.fetch(url.toString(), {
                method: 'POST',
                headers: {...this.headers, ...headers},
                body
            }).then(HttpClientBrowserAdapter.mapResponse)
                .catch((e) => HttpClientBrowserAdapter.mapError(url.toString(), e))
        );
    }
}
