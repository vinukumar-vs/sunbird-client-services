import {Observable, Subject} from 'rxjs';
import {HttpClient} from './http-client';
import {CsHttpRequestType, CsHttpSerializer} from '../../interface';
import {CsNetworkError} from '../../errors';
import {CsHttpResponseCode, CsResponse} from '../../interface';
import {CsHttpClientError} from '../../errors';
import {CsHttpServerError} from '../../errors';
import {injectable} from 'inversify';

interface CordovaHttpClientResponse {
    data?: string;
    error?: string;
    status: number;
}

@injectable()
export class HttpClientCordovaAdapter implements HttpClient {

    private http = window['cordova'].plugin.http;

    constructor() {
    }

    setSerializer(httpSerializer: CsHttpSerializer) {
        this.http.setDataSerializer(httpSerializer);
    }

    addHeaders(headers: { [key: string]: string }) {
        for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
                this.http.setHeader('*', key, headers[key]);
            }
        }
    }

    addHeader(key: string, value: string) {
        this.http.setHeader('*', key, value);
    }

    get(baseUrl: string, path: string, headers: any, parameters: { [key: string]: string }): Observable<CsResponse> {
        return this.invokeRequest(CsHttpRequestType.GET, baseUrl + path, parameters, headers);
    }

    patch(baseUrl: string, path: string, headers: any, body: {}): Observable<CsResponse> {
        return this.invokeRequest(CsHttpRequestType.PATCH, baseUrl + path, body, headers);
    }

    post(baseUrl: string, path: string, headers: any, body: {}): Observable<CsResponse> {
        return this.invokeRequest(CsHttpRequestType.POST, baseUrl + path, body, headers);
    }

    private invokeRequest(type: CsHttpRequestType, url: string, parametersOrData: any,
                          headers: { [key: string]: string }): Observable<CsResponse> {
        const observable = new Subject<CsResponse>();

        this.http[type.toLowerCase()](url, parametersOrData, headers, (response: CordovaHttpClientResponse) => {
            const r = new CsResponse();

            try {
                r.body = JSON.parse(response.data!);
            } catch (e) {
                r.body = response.data;
            }

            r.responseCode = response.status;
            r.errorMesg = '';
            observable.next(r);
            observable.complete();

        }, (response: CordovaHttpClientResponse) => {
            const r = new CsResponse();

            if (response.status === 0) {
                observable.error(new CsNetworkError(`
                    ${url} -
                    ${response.error || ''}
                `));
                observable.complete();

                return;
            }


            try {
                r.body = JSON.parse(response.error!);
                r.responseCode = response.status;
                r.errorMesg = 'SERVER_ERROR';

                if (r.responseCode === CsHttpResponseCode.HTTP_UNAUTHORISED || r.responseCode === CsHttpResponseCode.HTTP_FORBIDDEN) {
                    observable.next(r);
                    observable.complete();
                } else {
                    if (r.responseCode >= 400 && r.responseCode <= 499) {
                        observable.error(new CsHttpClientError(`
                            ${url} -
                            ${response.error || ''}
                        `, r));
                    } else {
                        observable.error(new CsHttpServerError(`
                            ${url} -
                            ${response.error || ''}
                        `, r));
                    }
                }
            } catch (e) {
                observable.error(new CsNetworkError(`
                    ${url} -
                    ${response.error || ''}
                `));
                observable.complete();
            }
        });

        return observable;
    }
}
