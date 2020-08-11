import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsFormService, FormParams} from '../interface/cs-form-service';
import {FormServiceImpl} from './form-service-impl';
import {of} from 'rxjs';

describe('FormServiceImpl', () => {
    let formService: CsFormService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.form.FORM_SERVICE_API_PATH).toConstantValue(mockApiPath);
        container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(container);

        container.bind<CsFormService>(InjectionTokens.services.form.FORM_SERVICE).to(FormServiceImpl).inSingletonScope();

        formService = container.get<CsFormService>(InjectionTokens.services.form.FORM_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(formService).toBeTruthy();
    });

    it('should be able to fetch form configuration passing appropriate params', (done) => {
        mockHttpService.fetch = jest.fn(() => {
            const response = new CsResponse();
            response.responseCode = 200;
            response.body = {
                'result': {
                    'form': {
                        'type': 'group',
                        'subtype': 'activities_v2',
                        'action': 'list',
                        'component': '*',
                        'framework': '*',
                        'data': {
                            'templateName': 'activities_v2',
                            'action': 'list',
                            'fields': [
                                {
                                    'index': 0,
                                    'title': 'ACTIVITY_COURSE_TITLE',
                                    'activityType': 'Course',
                                    'objectType': 'Content',
                                    'isEnabled': true,
                                    'sortBy': [
                                        {
                                            'name': 'asc'
                                        }
                                    ],
                                    'searchQuery': '{"request":{"filters":{"contentType":["Course"],"status":["Live"],"objectType":["Content"]}}}'
                                }
                            ]
                        }
                    }
                }
            };
            return of(response);
        });

        const params: FormParams = {
            'type': 'group',
            'subType': 'activities_v2',
            'action': 'list'
        };

        formService.getForm<{}>(params).subscribe((response) => {
            expect(response).toEqual(expect.objectContaining({
                'type': 'group',
                'subtype': 'activities_v2',
                'action': 'list',
                'component': '*',
                'framework': '*'
            }));
            done();
        });
    });
});
