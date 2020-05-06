import {Observable, from} from 'rxjs';
import * as qs from 'qs';
import {HttpClient} from './http-client';
import {CsHttpSerializer} from '../../interface/cs-request';
import {CsHttpServerError} from '../../errors';
import {CsNetworkError} from '../../errors';
import {CsResponse as ScResponse, CsHttpResponseCode} from '../../interface/cs-response';

export class HttpClientBrowserAdapter implements HttpClient {
    private headers: { [key: string]: string } = {};
    private serializer?: CsHttpSerializer;

    private static async mapError(url: string, e: any): Promise<ScResponse> {
        if (e instanceof CsHttpServerError || e instanceof CsNetworkError) {
            throw e;
        }

        throw new CsNetworkError(`
            ${url} -
            ${e || ''}
        `);
    }

    private static async mapResponse(response: Response): Promise<ScResponse> {
        const scResponse = new ScResponse<any>();
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

        throw new CsHttpServerError(`
            ${response.url}
        `, scResponse);
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

    get(baseUrl: string, path: string, headers: any, parameters: any): Observable<ScResponse> {
        const url = new URL(baseUrl + path);

        if (typeof parameters === 'object') {
            Object.keys(parameters).forEach((key) => {
                url.searchParams.append(key, parameters[key]);
            });
        }

        return from(
            window.fetch(url.toString(), {
                method: 'GET',
                headers: new Headers({...this.headers, ...headers}),
            }).then(HttpClientBrowserAdapter.mapResponse)
                .catch((e) => HttpClientBrowserAdapter.mapError(url.toString(), e))
        );
    }

    patch(baseUrl: string, path: string, headers: any, body: any): Observable<ScResponse> {
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
                headers: new Headers({...this.headers, ...headers}),
                body
            }).then(HttpClientBrowserAdapter.mapResponse)
                .catch((e) => HttpClientBrowserAdapter.mapError(url.toString(), e))
        );
    }

    post(baseUrl: string, path: string, headers: any, body: any): Observable<ScResponse> {
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
                headers: new Headers({...this.headers, ...headers}),
                body
            }).then(HttpClientBrowserAdapter.mapResponse)
                .catch((e) => HttpClientBrowserAdapter.mapError(url.toString(), e))
        );
    }
}
