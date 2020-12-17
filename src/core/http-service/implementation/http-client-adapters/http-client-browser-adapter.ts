import { defer, Observable } from 'rxjs';
import * as qs from 'qs';
import { HttpClient } from './http-client';
import { CsHttpRequestType, CsHttpSerializer, CsResponse } from '../../interface';
import { CsHttpClientError, CsHttpServerError, CsNetworkError } from '../../errors';
import { injectable } from 'inversify';

@injectable()
export class HttpClientBrowserAdapter implements HttpClient {
    private headers: { [key: string]: string } = {};
    private serializer?: CsHttpSerializer;

    private static async mapError(url: string, e: any): Promise<CsResponse> {
        if (CsHttpServerError.isInstance(e) || CsHttpClientError.isInstance(e)) {
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

        scResponse.body = await response.text();

        scResponse.headers = {};
        if (response.headers) {
            response.headers.forEach((v, k) => scResponse.headers[k] = v);
        }

        try {
            scResponse.body = JSON.parse(scResponse.body);
        } catch (e) {
            scResponse.body = scResponse.body;
        }

        if (response.ok) {
            return scResponse;
        }

        scResponse.errorMesg = 'SERVER_ERROR';

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

    constructor() { }

    setSerializer(httpSerializer: CsHttpSerializer) {
        this.serializer = httpSerializer;
    }

    addHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    addHeaders(headers: { [p: string]: string }) {
        this.headers = { ...this.headers, ...headers };
    }

    get(baseUrl: string, path: string, headers: any, parameters: any, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        const url = new URL(baseUrl + path);

        this.addHeader('content-type', 'text/plain');

        if (typeof parameters === 'object') {
            Object.keys(parameters).forEach((key) => {
                url.searchParams.append(key, parameters[key]);
            });
        }

        return this.invokeRequest(CsHttpRequestType.GET, url, headers, undefined);
    }

    delete(baseUrl: string, path: string, headers: any, parameters: any, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        const url = new URL(baseUrl + path);

        this.addHeader('content-type', 'text/plain');

        if (typeof parameters === 'object') {
            Object.keys(parameters).forEach((key) => {
                url.searchParams.append(key, parameters[key]);
            });
        }

        return this.invokeRequest(CsHttpRequestType.DELETE, url, headers, undefined);
    }

    patch(baseUrl: string, path: string, headers: any, body: any, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        const url = new URL(baseUrl + path);

        if (httpSerializer === CsHttpSerializer.URLENCODED && typeof body === 'object') {
            this.addHeader('content-type', 'application/x-www-form-urlencoded');
            body = qs.stringify(body);
        } else if (typeof body === 'object') {
            delete this.headers['content-type'];
            body = JSON.stringify(body);
        }

        return this.invokeRequest(CsHttpRequestType.PATCH, url, headers, body);
    }

    post(baseUrl: string, path: string, headers: any, body: any, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        const url = new URL(baseUrl + path);

        if (httpSerializer === CsHttpSerializer.URLENCODED && typeof body === 'object') {
            this.addHeader('content-type', 'application/x-www-form-urlencoded');
            body = qs.stringify(body);
        } else if (typeof body === 'object') {
            delete this.headers['content-type'];
            body = JSON.stringify(body);
        }

        return this.invokeRequest(CsHttpRequestType.POST, url, headers, body);
    }

    private invokeRequest(method: CsHttpRequestType, url: URL, headers: { [key: string]: string }, body?: any): Observable<CsResponse> {
        return defer(() =>
            fetch(url.toString(), {
                method,
                headers: { ...this.headers, ...headers },
                body,
                credentials: 'same-origin'
            }).then(HttpClientBrowserAdapter.mapResponse)
                .catch((e) => HttpClientBrowserAdapter.mapError(url.toString(), e))
        ) as Observable<CsResponse>;
    }
}
