import {CsUserService} from '../interface';
import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {UserServiceImpl} from './user-service-impl';
import {of} from 'rxjs';

describe('UserServiceImpl', () => {
    let userService: CsUserService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.user.USER_SERVICE_API_PATH).toConstantValue(mockApiPath);

        container.bind<CsUserService>(InjectionTokens.services.user.USER_SERVICE).to(UserServiceImpl).inSingletonScope();

        userService = container.get<CsUserService>(InjectionTokens.services.user.USER_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(userService).toBeTruthy();
    });

    describe('checkUserExists()', () => {
        it('should be able to check if user exists with matching fields in request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        exists: true,
                        id: 'SOME_USER_ID',
                        userId: 'SOME_USER_ID',
                        name: 'SOME_NAME',
                        managedBy: 'SOME_OTHER_USER_ID'
                    }
                };
                return of(response);
            });

            userService.checkUserExists({
                key: 'userId',
                value: 'SOME_USER_ID'
            }, 'SOME_CAPTCHA_RESPONSE_TOKEN').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                    path: expect.stringContaining('/exists/userId/SOME_USER_ID'),
                    parameters: {
                        captchaResponse: 'SOME_CAPTCHA_RESPONSE_TOKEN'
                    }
                }));
                expect(r).toEqual({
                    exists: true,
                    id: 'SOME_USER_ID',
                    userId: 'SOME_USER_ID',
                    name: 'SOME_NAME',
                    managedBy: 'SOME_OTHER_USER_ID'
                });
                done();
            });
        });
    });
});
