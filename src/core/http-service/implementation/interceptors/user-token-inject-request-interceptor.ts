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
        const userToken = this.container.get<string>(InjectionTokens.core.api.authentication.USER_TOKEN);
        const manageUserToken = this.container.get<string>(InjectionTokens.core.api.authentication.MANAGED_USER_TOKEN);
        if (userToken) {
            request.headers['X-Authenticated-User-Token'] = userToken;
        }
        if (manageUserToken) {
            request.headers['X-Authenticated-For'] = manageUserToken;
        }
        return of(request);
    }
}
