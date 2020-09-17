import {Observable} from 'rxjs';
import {Form} from '../../../models/form';
import {CsFormServiceConfig} from '../../../cs-module';

export interface FormParams {
    type: string;
    subType: string;
    action: string;
    component?: string;
    rootOrgId?: string;
    framework?: string;
}

export interface CsFormService {
    getForm<Field>(params: FormParams, config?: CsFormServiceConfig): Observable<Form<Field>>;
}
