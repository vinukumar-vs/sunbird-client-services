import {Observable} from 'rxjs';
import {CsUserServiceConfig} from '../../../index';

export interface CheckUserExistsResponse {
    exists: boolean;
    id?: string;
    userId?: string;
    name?: string;
    managedBy?: string;
}

export interface CsUserService {
    checkUserExists(matching: { key: string, value: string }, captchaResponseToken: string, config?: CsUserServiceConfig): Observable<CheckUserExistsResponse>;
}
