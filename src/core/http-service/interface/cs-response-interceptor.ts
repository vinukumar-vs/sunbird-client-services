import {CsRequest} from './cs-request';
import {CsResponse} from './cs-response';
import {Observable} from 'rxjs';

export interface CsResponseInterceptor {
    interceptResponse(request: CsRequest, response: CsResponse): Observable<CsResponse>;
}
