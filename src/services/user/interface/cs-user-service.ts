import {Observable} from 'rxjs';
import {CsUserServiceConfig} from '../../../index';
import {Consent, UserDeclaration, UserFeedEntry, UserFeedStatus} from '../../../models';

export interface CheckUserExistsResponse {
    exists: boolean;
    id?: string;
    userId?: string;
    name?: string;
    managedBy?: string;
}

export interface UpdateConsentResponse {
    consent: {
        userId: string;
    };
    message?: string;
}

export interface ReadConsentResponse {
    consents?: Consent[];
}

export interface CsUpdateUserFeedRequest {
    status?: UserFeedStatus;
}

// tslint:disable-next-line:no-empty-interface
export interface CsUpdateUserDeclarationsResponse {
}

// tslint:disable-next-line:no-empty-interface
export interface CsUpdateUserFeedStatusResponse {
}

export interface CsUserService {
    checkUserExists(
        matching: { key: string, value: string }, captchaResponse?: { token: string, app?: string }, config?: CsUserServiceConfig
    ): Observable<CheckUserExistsResponse>;

    updateUserDeclarations(declarations: UserDeclaration[], config?: CsUserServiceConfig): Observable<CsUpdateUserDeclarationsResponse>;

    updateConsent(userConsent: Consent, config?: CsUserServiceConfig): Observable<UpdateConsentResponse>;

    getConsent(userConsent: Consent, config?: CsUserServiceConfig): Observable<ReadConsentResponse>;

    getUserFeed(uid: string, config?: CsUserServiceConfig): Observable<UserFeedEntry[]>;

    updateUserFeedEntry(
        uid: string, feedEntryId: string, request: CsUpdateUserFeedRequest, config?: CsUserServiceConfig
    ): Observable<CsUpdateUserFeedStatusResponse>;
}
