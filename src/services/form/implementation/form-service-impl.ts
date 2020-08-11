import {CsFormService, FormParams} from '../interface/cs-form-service';
import {CsFormServiceConfig} from '../../../cs-module';
import {Observable} from 'rxjs';
import {Form} from '../../../models/form';
import {inject, injectable} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map} from 'rxjs/operators';

@injectable()
export class FormServiceImpl implements CsFormService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.form.FORM_SERVICE_API_PATH) private apiPath: string
    ) {
    }

    getForm<Field>(params: FormParams, config?: CsFormServiceConfig): Observable<Form<Field>> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath((config ? config.apiPath : this.apiPath) + '/read')
            .withBody({
                request: params
            })
            .withBearerToken(true)
            .build();

        return this.httpService.fetch<{ result: { form: Form<Field> } }>(apiRequest).pipe(
            map((response) => {
                return response.body.result.form;
            })
        );
    }
}
