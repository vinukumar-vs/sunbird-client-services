import {CsRequestInterceptor} from '../../interface/cs-request-interceptor';
import {Observable, of} from 'rxjs';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../../index';
import {CsRequest} from '../../interface/cs-request';

export class BearerTokenInjectRequestInterceptor implements CsRequestInterceptor {
    constructor(
        private container: Container
    ) {
    }

    interceptRequest(request: CsRequest): Observable<CsRequest> {
        request.headers['Authorization'] = `Bearer ${this.container.get<string>(InjectionTokens.core.api.authentication.BEARER_TOKEN)}`;
        return of(request);
    }
}
