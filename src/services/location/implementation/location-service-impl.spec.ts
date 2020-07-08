import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsLocationService} from '../interface';
import {LocationServiceImpl} from './location-service-impl';
import {of} from 'rxjs';

describe('LocationServiceImpl', () => {
    let locationService: CsLocationService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.location.LOCATION_SERVICE_API_PATH).toConstantValue(mockApiPath);

        container.bind<CsLocationService>(InjectionTokens.services.location.LOCATION_SERVICE).to(LocationServiceImpl).inSingletonScope();

        locationService = container.get<CsLocationService>(InjectionTokens.services.location.LOCATION_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(locationService).toBeTruthy();
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

            const request = {
                filter: {
                    type: 'state'
                }
            };

            locationService.searchLocations(request).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    body: {
                        request
                    }
                }));
                done();
            });
        });
    });
});
