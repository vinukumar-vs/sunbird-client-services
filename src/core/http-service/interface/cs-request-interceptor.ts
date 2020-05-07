import {CsRequest} from './cs-request';
import {Observable} from 'rxjs';

export interface CsRequestInterceptor {
    interceptRequest(request: CsRequest): Observable<CsRequest>;
}
