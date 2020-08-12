import {Observable} from 'rxjs';
import {CsUserServiceConfig} from '../../../index';
import {UserDeclaration} from '../../../models';

export interface CheckUserExistsResponse {
    exists: boolean;
    id?: string;
    userId?: string;
    name?: string;
    managedBy?: string;
}

export interface CsUpdateUserDeclarationsResponse {}

export interface CsUserService {
    checkUserExists(matching: { key: string, value: string }, captchaResponse?: { token: string, app?: string }, config?: CsUserServiceConfig): Observable<CheckUserExistsResponse>;

    updateUserDeclarations(declarations: UserDeclaration[], config?: CsUserServiceConfig): Observable<CsUpdateUserDeclarationsResponse>;
}
