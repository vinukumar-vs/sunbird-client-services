import {CsResponseInterceptor} from '../../interface/cs-response-interceptor';
import {CsResponse} from '../../interface/cs-response';
import {Observable, of} from 'rxjs';
import {CsRequest} from '../../interface/cs-request';

export class CsResponseLoggerInterceptor implements CsResponseInterceptor {
    interceptResponse(request: CsRequest, response: CsResponse<any>): Observable<CsResponse> {
        console.log('CsResponseLoggerInterceptor: ', 'response:', response);
        return of(response);
    }
}
