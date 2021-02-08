import {
    CheckUserExistsResponse,
    CsDeleteUserFeedResponse, CsProfileDetailsRequest, CsProfileUpdateRequest, CsProfileUpdateResponse,
    CsUpdateUserDeclarationsResponse,
    CsUpdateUserFeedRequest,
    CsUpdateUserFeedResponse,
    CsUserService,
    ReadConsentResponse,
    UpdateConsentResponse
} from '../interface';
import {inject, injectable} from 'inversify';
import {defer, Observable} from 'rxjs';
import {CsUserServiceConfig} from '../../../index';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map} from 'rxjs/operators';
import {Consent, User, UserDeclaration, UserFeedCategory, UserFeedEntry} from 'src/models';

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

    updateConsent(consent: Consent, config?: CsUserServiceConfig): Observable<UpdateConsentResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/consent/update`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    consent
                }
            })
            .build();

        return this.httpService.fetch<{ result: UpdateConsentResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    getConsent(consent: Consent, config?: CsUserServiceConfig): Observable<ReadConsentResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/consent/read`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    consent: {
                        filters: consent
                    }
                }
            })
            .build();

        return this.httpService.fetch<{ result: ReadConsentResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    getUserFeed(uid: string, config?: CsUserServiceConfig): Observable<UserFeedEntry[]> {
        const apiRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/feed/${uid}`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: { response: { userFeed: UserFeedEntry[] } } }>(apiRequest).pipe(
            map((response) => {
                return response.body.result.response.userFeed;
            })
        );
    }

    updateUserFeedEntry(
        uid: string, feedEntryId: string, category: UserFeedCategory, request: CsUpdateUserFeedRequest, config?: CsUserServiceConfig
    ): Observable<CsUpdateUserFeedResponse> {
        return defer(async () => {
            const userFeed = await this.getUserFeed(uid, config).toPromise();

            const entry = userFeed.find((e) =>
                e.id === feedEntryId && e.category === category
            );

            if (!entry) {
                return {};
            }

            const apiRequest = new CsRequest.Builder()
                .withType(CsHttpRequestType.PATCH)
                .withPath(`${config ? config.apiPath : this.apiPath}/feed/update`)
                .withBearerToken(true)
                .withUserToken(true)
                .withBody({
                    request: {
                        userId: uid,
                        priority: entry.priority,
                        category: entry.category,
                        feedId: entry.id,
                        status: request.status,
                        data: entry.data
                    }
                })
                .build();

            return this.httpService.fetch<{ result: { response: any } }>(apiRequest).pipe(
                map((response) => {
                    return response.body.result.response;
                })
            ).toPromise();
        });
    }

    deleteUserFeedEntry(
        uid: string, feedEntryId: string, category: UserFeedCategory, config?: CsUserServiceConfig
    ): Observable<CsDeleteUserFeedResponse> {
        const apiRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/feed/delete`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    userId: uid,
                    category: category,
                    feedId: feedEntryId,
                }
            })
            .build();

        return this.httpService.fetch<{ result: { response: any } }>(apiRequest).pipe(
            map((response) => {
                return response.body.result.response;
            })
        );
    }

    getProfileDetails(profileDetailsRequest: CsProfileDetailsRequest, config?: CsUserServiceConfig): Observable<User> {
        const apiRequest = new CsRequest.Builder()
          .withType(CsHttpRequestType.GET)
          .withPath(`${config ? config.apiPath : this.apiPath}/read/${profileDetailsRequest.userId}`)
          .withParameters({'fields': profileDetailsRequest.requiredFields.join(',')})
          .withBearerToken(true)
          .withUserToken(true)
          .withBody(profileDetailsRequest)
          .build();

        return this.httpService.fetch<{ result: { response: User } }>(apiRequest).pipe(
          map((response) => {
              return response.body.result.response;
          })
        );
    }

    updateProfile(profileUpdateRequest: CsProfileUpdateRequest, config?: CsUserServiceConfig): Observable<CsProfileUpdateResponse> {
        const apiRequest = new CsRequest.Builder()
          .withType(CsHttpRequestType.PATCH)
          .withPath(`${config ? config.apiPath : this.apiPath}/update`)
          .withBearerToken(true)
          .withUserToken(true)
          .withBody({request: profileUpdateRequest})
          .build();

        return this.httpService.fetch<{ result: CsProfileUpdateResponse }>(apiRequest).pipe(
          map((response) => {
              return response.body.result;
          })
        );
    }
}
