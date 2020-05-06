import {CsRequestInterceptor} from '../../interface';
import {Observable, of} from 'rxjs';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../../injection-tokens';
import {CsRequest} from '../../interface';

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
