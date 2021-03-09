import {CsSystemSettingsService} from '../interface';
import {Observable} from 'rxjs';
import {CsSystemSettingsServiceConfig} from '../../../cs-module';
import {inject, injectable, optional} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map} from 'rxjs/operators';

@injectable()
export class SystemSettingsServiceImpl implements CsSystemSettingsService {
  constructor(
    @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
    @optional() @inject(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE_API_PATH) private apiPath: string = '',
  ) {
  }

  getSystemSettings(id: string, config?: CsSystemSettingsServiceConfig): Observable<string> {
    const apiRequest: CsRequest = new CsRequest.Builder()
      .withType(CsHttpRequestType.GET)
      .withPath(`${config ? config.apiPath : this.apiPath}/system/settings/get/${id}`)
      .withBearerToken(true)
      .build();

    return this.httpService.fetch<{
      result: {
        response: {
          id: string;
          field: string;
          value: string;
        }
      }
    }>(apiRequest).pipe(
      map((response) => {
        return response.body.result.response.value;
      })
    );
  }
}
