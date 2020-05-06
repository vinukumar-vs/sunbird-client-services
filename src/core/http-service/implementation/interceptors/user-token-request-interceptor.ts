import {CsRequestInterceptor} from '../../interface/cs-request-interceptor';
import {Observable, of} from 'rxjs';
import {InjectionTokens} from '../../../../index';
import {Container} from 'inversify';
import {CsRequest} from '../../interface/cs-request';

export class UserTokenRequestInterceptor implements CsRequestInterceptor {
    constructor(
        private container: Container
    ) {
    }

    interceptRequest(request: CsRequest): Observable<CsRequest> {
        request.headers['X-Authenticated-User-Token'] = this.container.get<string>(InjectionTokens.core.api.authentication.USER_TOKEN);
        return of(request);
    }
}
