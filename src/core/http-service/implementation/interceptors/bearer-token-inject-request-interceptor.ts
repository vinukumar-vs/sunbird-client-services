import {RequestInterceptor} from '../../interface/request-interceptor';
import {Observable, of} from 'rxjs';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../../index';
import {Request} from '../../interface/request';

export class BearerTokenInjectRequestInterceptor implements RequestInterceptor {
    constructor(
        private container: Container
    ) {
    }

    interceptRequest(request: Request): Observable<Request> {
        request.headers['Authorization'] = `Bearer ${this.container.get<string>(InjectionTokens.core.api.authentication.BEARER_TOKEN)}`;
        return of(request);
    }
}
