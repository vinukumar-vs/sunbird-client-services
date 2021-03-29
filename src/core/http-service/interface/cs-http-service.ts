import {Observable} from 'rxjs';
import {CsRequest} from './cs-request';
import {CsResponse} from './cs-response';
import {CsRequestInterceptor} from './cs-request-interceptor';
import {CsResponseInterceptor} from './cs-response-interceptor';

export interface CsHttpService {
    requestInterceptors: CsRequestInterceptor[];
    responseInterceptors: CsResponseInterceptor[];
    fetch<T>(request: CsRequest): Observable<CsResponse<T>>;
    init();
}
