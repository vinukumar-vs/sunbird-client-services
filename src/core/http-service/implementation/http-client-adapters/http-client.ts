import {CsResponse} from '../../interface/cs-response';
import {Observable} from 'rxjs';
import {CsHttpSerializer} from '../../interface/cs-request';

export abstract class HttpClient {
    abstract setSerializer(httpSerializer: CsHttpSerializer);

    abstract addHeaders(headers: { [key: string]: string });

    abstract addHeader(key: string, value: string);

    abstract get(baseUrl: string, path: string, headers: any, parameters: any, httpSerializer: CsHttpSerializer): Observable<CsResponse>;

    abstract post(baseUrl: string, path: string, headers: any, body: any, httpSerializer: CsHttpSerializer): Observable<CsResponse>;

    abstract patch(baseUrl: string, path: string, headers: any, body: any, httpSerializer: CsHttpSerializer): Observable<CsResponse>;

    abstract delete(baseUrl: string, path: string, headers: any, parameters: any, httpSerializer: CsHttpSerializer): Observable<CsResponse>;
}
