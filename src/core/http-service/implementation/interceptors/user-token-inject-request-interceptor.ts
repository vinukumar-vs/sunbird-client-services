import {CsRequest, CsRequestInterceptor} from '../../interface';
import {Observable, of} from 'rxjs';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../../injection-tokens';

export class UserTokenInjectRequestInterceptor implements CsRequestInterceptor {
    constructor(
        private container: Container
    ) {
    }

    interceptRequest(request: CsRequest): Observable<CsRequest> {
        request.headers['X-Authenticated-User-Token'] = this.container.get<string>(InjectionTokens.core.api.authentication.USER_TOKEN);
        return of(request);
    }
}
