import {CheckUserExistsResponse, CsUserService} from '../interface';
import {inject, injectable} from 'inversify';
import {Observable} from 'rxjs';
import {CsUserServiceConfig} from '../../../index';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map} from 'rxjs/operators';

@injectable()
export class UserServiceImpl implements CsUserService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.user.USER_SERVICE_API_PATH) private apiPath: string
    ) {
    }

    checkUserExists(matching: { key: string; value: string }, captchaResponseToken, config?: CsUserServiceConfig): Observable<CheckUserExistsResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/exists/${matching.key}/${matching.value}`)
            .withBearerToken(true)
            .withUserToken(true)
            .withParameters({
                captchaResponse: captchaResponseToken
            })
            .build();

        return this.httpService.fetch<{ result: CheckUserExistsResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }
}
