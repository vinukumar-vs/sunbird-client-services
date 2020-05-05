import {RequestInterceptor} from '../../interface/request-interceptor';
import {Observable, of} from 'rxjs';
import {InjectionTokens} from '../../../../index';
import {Container} from 'inversify';
import {Request} from '../../interface/request';

export class UserTokenRequestInterceptor implements RequestInterceptor {
    constructor(
        private container: Container
    ) {
    }

    interceptRequest(request: Request): Observable<Request> {
        request.headers['X-Authenticated-User-Token'] = this.container.get<string>(InjectionTokens.core.api.authentication.USER_TOKEN);
        return of(request);
    }
}
