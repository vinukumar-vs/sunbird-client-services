import {CsFrameworkServiceConfig} from '../../../index';
import {Observable} from 'rxjs';
import {Framework} from '../../../models/channel';

export interface GetFrameworkOptions {
    requiredCategories: string[];
}

export interface CsFrameworkService {

    getFramework(id: string, options?: GetFrameworkOptions, config?: CsFrameworkServiceConfig): Observable<Framework>;

}
