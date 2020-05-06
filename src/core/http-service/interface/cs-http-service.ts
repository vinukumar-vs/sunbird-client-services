import {Observable} from 'rxjs';
import {CsRequest} from './cs-request';
import {CsResponse} from './cs-response';

export interface CsHttpService {
    fetch<T>(request: CsRequest): Observable<CsResponse<T>>;
}
