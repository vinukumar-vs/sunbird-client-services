import {Observable, Subject} from 'rxjs';
import {HttpClient} from './http-client';
import {CsHttpRequestType, CsHttpSerializer, CsResponse} from '../../interface';
import {CsHttpClientError, CsHttpServerError, CsNetworkError} from '../../errors';
import {injectable} from 'inversify';

interface CordovaHttpClientResponse {
    data?: string;
    error?: string;
    status: number;
    headers?: any;
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

    get(baseUrl: string, path: string, headers: any, parameters: { [key: string]: string }, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        return this.invokeRequest(CsHttpRequestType.GET, baseUrl + path, parameters, headers, httpSerializer);
    }

    delete(baseUrl: string, path: string, headers: any, parameters: { [key: string]: string }, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        return this.invokeRequest(CsHttpRequestType.DELETE, baseUrl + path, parameters, headers, httpSerializer);
    }

    patch(baseUrl: string, path: string, headers: any, body: {}, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        return this.invokeRequest(CsHttpRequestType.PATCH, baseUrl + path, body, headers, httpSerializer);
    }

    post(baseUrl: string, path: string, headers: any, body: {}, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        return this.invokeRequest(CsHttpRequestType.POST, baseUrl + path, body, headers, httpSerializer);
    }

    private invokeRequest(type: CsHttpRequestType, url: string, parametersOrData: any,
                          headers: { [key: string]: string }, httpSerializer: CsHttpSerializer): Observable<CsResponse> {
        const observable = new Subject<CsResponse>();

        const requestOptions = {
            method: type.toLowerCase(),
            headers: headers,
            serializer: httpSerializer,
        };

        if (
          type === CsHttpRequestType.POST ||
          type === CsHttpRequestType.PATCH
        ) {
            requestOptions['data']  = parametersOrData;
        } else if (
          type === CsHttpRequestType.GET ||
          type === CsHttpRequestType.DELETE
        ) {
            requestOptions['params']  = parametersOrData;
        }

        this.http.sendRequest(url, requestOptions, (response: CordovaHttpClientResponse) => {
            const r = new CsResponse();

            try {
                r.body = JSON.parse(response.data!);
            } catch (e) {
                r.body = response.data;
            }

            r.responseCode = response.status;
            r.errorMesg = '';
            r.headers = response.headers;
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
                try {
                    r.body = JSON.parse(response.error!);
                } catch (e) {
                    r.body = response.error;
                    if (response.status <= 0) {
                      throw e;
                    }
                }

                r.responseCode = response.status;
                r.errorMesg = 'SERVER_ERROR';
                r.headers = response.headers;

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
