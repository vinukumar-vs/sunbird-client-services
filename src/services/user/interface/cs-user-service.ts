import {Observable} from 'rxjs';
import {CsUserServiceConfig} from '../../../index';
import {Consent, User, UserDeclaration, UserFeedCategory, UserFeedEntry, UserFeedStatus} from '../../../models';

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
export interface CsUpdateUserFeedResponse {
}

// tslint:disable-next-line:no-empty-interface
export interface CsDeleteUserFeedResponse {
}

export interface CsProfileDetailsRequest {
    userId: string;
    requiredFields: string[];
}

export interface CsProfileUpdateRequest {
    userId: string;
    phone?: string;
    email?: string;
    phoneVerified?: boolean;
    emailVerified?: boolean;
    locationCodes?: Array<string>;
    firstName?: string;
    lastName?: string;
    framework?: { [key: string]: any };
    profileSummary?: string;
    recoveryEmail?: string;
    recoveryPhone?: string;
    externalIds?: {
        id: string;
        operation: string;
        idType: string;
        provider: string;
    }[];
    userType?: string;
    userSubType?: string;
}

export interface CsProfileUpdateResponse {
    response: string;
    errors: Array<any>;
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
        uid: string, feedEntryId: string, category: UserFeedCategory, request: CsUpdateUserFeedRequest, config?: CsUserServiceConfig
    ): Observable<CsUpdateUserFeedResponse>;

    deleteUserFeedEntry(
        uid: string, feedEntryId: string, category: UserFeedCategory, config?: CsUserServiceConfig
    ): Observable<CsDeleteUserFeedResponse>;

    getProfileDetails(profileDetailsRequest: CsProfileDetailsRequest, config?: CsUserServiceConfig): Observable<User>;

    updateProfile(profileUpdateRequest: CsProfileUpdateRequest, config?: CsUserServiceConfig): Observable<CsProfileUpdateResponse>;
}
