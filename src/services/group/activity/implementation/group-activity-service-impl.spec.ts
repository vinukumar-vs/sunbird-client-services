import {CsGroupActivityService} from '..';
import {CsHttpService, CsResponse} from '../../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../../injection-tokens';
import {GroupActivityServiceImpl} from './group-activity-service-impl';
import {of} from 'rxjs';

describe('GroupActivityServiceImpl', () => {
    let activityService: CsGroupActivityService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockDataApiPath = 'MOCK_DATA_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.group.GROUP_SERVICE_DATA_API_PATH).toConstantValue(mockDataApiPath);

        container.bind<CsGroupActivityService>(InjectionTokens.services.group.GROUP_ACTIVITY_SERVICE).to(GroupActivityServiceImpl).inSingletonScope();

        activityService = container.get<CsGroupActivityService>(InjectionTokens.services.group.GROUP_ACTIVITY_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(activityService).toBeTruthy();
    });

    describe('getDataAggregation()', () => {
        it('should be able to get data aggregation of a group activity', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {}
                };
                return of(response);
            });

            const activity = {
                id: 'SOME_ACTIVITY_ID',
                type: 'SOME_ACTIVITY_TYPE'
            };

            activityService.getDataAggregation('SOME_GROUP_ID', activity).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        request: {
                            groupId: 'SOME_GROUP_ID',
                            activityId: 'SOME_ACTIVITY_ID',
                            activityType: 'SOME_ACTIVITY_TYPE'
                        }
                    }
                }));
                done();
            });
        });
    });
});
