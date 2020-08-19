import {CsFrameworkService, GetFrameworkOptions} from '../interface';
import {inject, injectable} from 'inversify';
import {CsFrameworkServiceConfig} from '../../../index';
import {Observable} from 'rxjs';
import {Framework} from '../../../models/channel';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map} from 'rxjs/operators';

@injectable()
export class FrameworkServiceImpl implements CsFrameworkService {

    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.framework.FRAMEWORK_SERVICE_API_PATH) private apiPath: string
    ) {
    }

    getFramework(id: string, options?: GetFrameworkOptions, config?: CsFrameworkServiceConfig): Observable<Framework> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath( (config ? config.apiPath : this.apiPath ) + '/read/' + id)
            .withParameters({
                ...(options ? {categories: options.requiredCategories.join(',')} : {})
            })
            .withBearerToken(true)
            .build();

        return this.httpService.fetch<{ result: { framework: Framework } }>(apiRequest).pipe(
            map((response) => {
                return response.body.result.framework;
            })
        );
    }

}
