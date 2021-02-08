import {Observable} from 'rxjs';
import {CsSystemSettingsServiceConfig} from '../../../cs-module';

export interface CsSystemSettingsService {
  getSystemSettings(id: string, config?: CsSystemSettingsServiceConfig): Observable<string>;
}
