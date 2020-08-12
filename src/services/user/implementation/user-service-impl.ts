import {CheckUserExistsResponse, CsUserService, CsUpdateUserDeclarationsResponse} from '../interface';
import {inject, injectable} from 'inversify';
import {Observable} from 'rxjs';
import {CsUserServiceConfig} from '../../../index';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map} from 'rxjs/operators';
import {UserDeclaration} from 'src/models';

@injectable()
export class UserServiceImpl implements CsUserService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.user.USER_SERVICE_API_PATH) private apiPath: string
    ) {
    }

    checkUserExists(
        matching: { key: string; value: string },
        captchaResponse?: { token: string, app?: string },
        config?: CsUserServiceConfig
    ): Observable<CheckUserExistsResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/exists/${matching.key}/${matching.value}`)
            .withBearerToken(true)
            .withUserToken(true)
            .withParameters({
                ...(captchaResponse ? {
                    captchaResponse: captchaResponse.token,
                    ...(captchaResponse.app ? {
                        app: captchaResponse.app
                    } : {})
                } : {}),
            })
            .build();

        return this.httpService.fetch<{ result: CheckUserExistsResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    updateUserDeclarations(declarations: UserDeclaration[], config?: CsUserServiceConfig): Observable<CsUpdateUserDeclarationsResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(`${config ? config.apiPath : this.apiPath}/declarations`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    declarations
                }
            })
            .build();

        return this.httpService.fetch<{ result: CheckUserExistsResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }
}
