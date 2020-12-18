import {CsRequestInterceptor} from '../../interface/cs-request-interceptor';
import {CsRequest} from '../../interface/cs-request';
import {Observable, of} from 'rxjs';

export class CsRequestLoggerInterceptor implements CsRequestInterceptor {
    interceptRequest(request: CsRequest): Observable<CsRequest> {
        console.log('CsRequestLoggerInterceptor: ', 'request:', request);
        return of(request);
    }
}
