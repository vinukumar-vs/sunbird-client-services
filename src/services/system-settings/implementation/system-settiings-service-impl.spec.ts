import {CsHttpRequestType, CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsSystemSettingsService} from '../interface';
import {SystemSettingsServiceImpl} from './system-settings-service-impl';
import {of} from 'rxjs';

describe('SystemSettingsServiceImpl', () => {
  let systemSettingsService: CsSystemSettingsService;
  const mockHttpService: Partial<CsHttpService> = {};
  const mockApiPath = 'MOCK_API_PATH';

  beforeAll(() => {
    const container = new Container();

    container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
    container.bind<string>(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE_API_PATH).toConstantValue(mockApiPath);

    container.bind<CsSystemSettingsService>(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE).to(SystemSettingsServiceImpl).inSingletonScope();

    systemSettingsService = container.get<CsSystemSettingsService>(InjectionTokens.services.systemSettings.SYSTEM_SETTINGS_SERVICE);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('should be able to get an instance from the container', () => {
    expect(systemSettingsService).toBeTruthy();
  });

  describe('searchLocations()', () => {
    it('should be able to search locations with optional filter', (done) => {
      mockHttpService.fetch = jest.fn(() => {
        const response = new CsResponse();
        response.responseCode = 200;
        response.body = {
          result: {
            response: []
          }
        };
        return of(response);
      });

      systemSettingsService.getSystemSettings('SAMPLE_SYSTEM_SETTINGS_ID').subscribe(() => {
        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
          type: CsHttpRequestType.GET,
          path: 'MOCK_API_PATH/system/settings/get/SAMPLE_SYSTEM_SETTINGS_ID'
        }));
        done();
      });
    });
  });
});
