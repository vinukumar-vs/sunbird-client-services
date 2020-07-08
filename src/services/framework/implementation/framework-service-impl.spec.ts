import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsFrameworkService} from '../interface';
import {of} from 'rxjs';
import {FrameworkServiceImpl} from './framework-service-impl';

describe('FrameworkServiceImpl', () => {
    let frameworkService: CsFrameworkService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.framework.FRAMEWORK_SERVICE_API_PATH).toConstantValue(mockApiPath);

        container.bind<CsFrameworkService>(InjectionTokens.services.framework.FRAMEWORK_SERVICE).to(FrameworkServiceImpl).inSingletonScope();

        frameworkService = container.get<CsFrameworkService>(InjectionTokens.services.framework.FRAMEWORK_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(frameworkService).toBeTruthy();
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

            frameworkService.getFramework('SOME_FRAMEWORK_ID', {requiredCategories: ['SOME_CATEGORY', 'SOME_CATEGORY_1']}).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                    parameters: {
                        categories: 'SOME_CATEGORY,SOME_CATEGORY_1'
                    }
                }));
                done();
            });
        });
    });
});
