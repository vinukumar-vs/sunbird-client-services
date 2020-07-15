import {CsRequest, CsRequestInterceptor} from '../../interface';
import {Observable, of} from 'rxjs';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../../injection-tokens';

export class BearerTokenInjectRequestInterceptor implements CsRequestInterceptor {
    constructor(
        private container: Container
    ) {
    }

    interceptRequest(request: CsRequest): Observable<CsRequest> {
        const bearerToken = this.container.get<string>(InjectionTokens.core.api.authentication.BEARER_TOKEN);
        if (bearerToken) {
            request.headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        return of(request);
    }
}
