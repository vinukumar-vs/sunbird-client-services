import { CsContentService } from '../interface';
import { CsHttpService, CsResponse } from '../../../core/http-service/interface';
import { Container } from 'inversify';
import { InjectionTokens } from '../../../injection-tokens';
import { ContentServiceImpl } from './content-service-impl';
import { of } from 'rxjs';
import { CsFormService } from '../../form/interface/cs-form-service';

describe('ContentServiceImpl', () => {
    let contentService: CsContentService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';
    const mockFormService: Partial<CsFormService> = {};

    beforeAll(() => {
        const container = new Container();
        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.content.CONTENT_SERVICE_HIERARCHY_API_PATH).toConstantValue(mockApiPath);
        container.bind<string>(InjectionTokens.services.content.CONTENT_SERVICE_QUESTION_LIST_API_PATH).toConstantValue(mockApiPath);
        container.bind<CsFormService>(InjectionTokens.services.form.FORM_SERVICE).toConstantValue(mockFormService as CsFormService);
        container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(container);
        container.bind<CsContentService>(InjectionTokens.services.content.CONTENT_SERVICE).to(ContentServiceImpl).inSingletonScope();
        contentService = container.get<CsContentService>(InjectionTokens.services.content.CONTENT_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    describe('when question APIs is called', () => {
        it('should be able to get question list response', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {};
                return of(response);
            });
            const contentIds = ['do_1132131789426933761152', 'do_113015077903966208165'];
            contentService.getQuestionList(contentIds, {
                hierarchyApiPath: '/some_api_path',
                questionListApiPath: '/some_api_path'
            }).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    path: expect.stringContaining('/some_api_path'),
                    body: {
                        request: {
                            search: {
                                identifier: contentIds
                            },
                        }
                    }
                }));
                done();
            });
        });

        it('should be able to get question hierarchy response', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {}
                };
                return of(response);
            });
            contentService.getQuestionSetHierarchy('do_1132131785524101121151', {
                hierarchyApiPath: '/some_api_path',
                questionListApiPath: '/some_api_path'
            }).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET'
                }));
                done();
            });
        });
    });
});
