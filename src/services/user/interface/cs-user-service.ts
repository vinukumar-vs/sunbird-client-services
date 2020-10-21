import {Observable} from 'rxjs';
import {CsUserServiceConfig} from '../../../index';
import {Consent, UserDeclaration, UserFeedEntry} from '../../../models';

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

// tslint:disable-next-line:no-empty-interface
export interface CsUpdateUserDeclarationsResponse {}

export interface CsUserService {
    checkUserExists(matching: { key: string, value: string }, captchaResponse?: { token: string, app?: string }, config?: CsUserServiceConfig): Observable<CheckUserExistsResponse>;

    updateUserDeclarations(declarations: UserDeclaration[], config?: CsUserServiceConfig): Observable<CsUpdateUserDeclarationsResponse>;

    updateConsent(userConsent: Consent, config?: CsUserServiceConfig): Observable<UpdateConsentResponse>;

    getConsent(userConsent: Consent, config?: CsUserServiceConfig): Observable<ReadConsentResponse>;

    getUserFeed(uid: string, config?: CsUserServiceConfig): Observable<UserFeedEntry[]>;
}
