import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {CsCourseService} from '../interface';
import {of} from 'rxjs';
import {CourseServiceImpl} from './course-service-impl';

describe('CourseServiceImpl', () => {
    let courseService: CsCourseService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.course.COURSE_SERVICE_API_PATH).toConstantValue(mockApiPath);
        container.bind<string>(InjectionTokens.services.course.COURSE_SERVICE_CERT_REGISTRATION_API_PATH).toConstantValue(mockApiPath);


        container.bind<CsCourseService>(InjectionTokens.services.course.COURSE_SERVICE).to(CourseServiceImpl).inSingletonScope();

        courseService = container.get<CsCourseService>(InjectionTokens.services.course.COURSE_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(courseService).toBeTruthy();
    });

    describe('getUserEnrolledCourses()', () => {
        it('should fetch enrolledCourseList of current userId', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        courses: []
                    }
                };
                return of(response);
            });

            const request = {
                userId: 'SOME_USER_ID',
                filters: {board: ['SOME_BOARD', 'SOME_BOARD_1']}
            };

            courseService.getUserEnrolledCourses(request, {'SOME_KEY': 'SOME_VALUE'}).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    parameters: {
                        'SOME_KEY': 'SOME_VALUE'
                    },
                    body: {
                        request
                    }
                }));
                done();
            });
        });

        describe('when optional configuration is passed', () => {
            it('should fetch enrolledCourseList of current userId with overridden apiPath', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            courses: []
                        }
                    };
                    return of(response);
                });

                const request = {
                    userId: 'SOME_USER_ID',
                    filters: {board: ['SOME_BOARD', 'SOME_BOARD_1']}
                };

                courseService.getUserEnrolledCourses(request, {'SOME_KEY': 'SOME_VALUE'}, {apiPath: '/some_overridden_path'}).subscribe(() => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_overridden_path/user/enrollment/list',
                        parameters: {
                            'SOME_KEY': 'SOME_VALUE'
                        },
                        body: {
                            request
                        }
                    }));
                    done();
                });
            });
        });
    });

    describe('getSignedCourseCertificate()', () => {
        describe('when appropriate configuration is present', () => {
            it('should fetch signedCourseCertificate', (done) => {
                // arrange
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            printUri: 'SAMPLE_PRINT_URI'
                        }
                    };
                    return of(response);
                });
                // act
                courseService.getSignedCourseCertificate('CERTIFICATE_ID').subscribe(() => {
                    // assert
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: 'MOCK_API_PATH/download/CERTIFICATE_ID'
                    }));
                    done();
                });
            });
        });

        describe('when appropriate configuration is overridden', () => {
            it('should fetch signedCourseCertificate', (done) => {
                // arrange
                let courseService2: CsCourseService;
                const container = new Container();
                container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
                container.bind<string>(InjectionTokens.services.course.COURSE_SERVICE_API_PATH).toConstantValue(mockApiPath);
                container.bind<CsCourseService>(InjectionTokens.services.course.COURSE_SERVICE).to(CourseServiceImpl).inSingletonScope();
                courseService2 = container.get<CsCourseService>(InjectionTokens.services.course.COURSE_SERVICE);

                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            printUri: 'SAMPLE_PRINT_URI'
                        }
                    };
                    return of(response);
                });
                // act
                courseService2.getSignedCourseCertificate('CERTIFICATE_ID', {
                    apiPath: '/some_overridden_path',
                    certRegistrationApiPath: '/some_overridden_path'
                }).subscribe(() => {
                    // assert
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_overridden_path/download/CERTIFICATE_ID'
                    }));
                    done();
                });
            });
        });

        describe('when appropriate configuration is absent', () => {
            it('should fail with error', (done) => {
                // arrange
                let courseService2: CsCourseService;
                const container = new Container();
                container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
                container.bind<string>(InjectionTokens.services.course.COURSE_SERVICE_API_PATH).toConstantValue(mockApiPath);
                container.bind<CsCourseService>(InjectionTokens.services.course.COURSE_SERVICE).to(CourseServiceImpl).inSingletonScope();
                courseService2 = container.get<CsCourseService>(InjectionTokens.services.course.COURSE_SERVICE);

                // act
                try {
                    courseService2.getSignedCourseCertificate('CERTIFICATE_ID').subscribe({
                        complete: () => fail()
                    });
                } catch (e) {
                    expect(e.message).toEqual('Required certRegistrationApiPath configuration');
                    done();
                }
            });
        });
    });
});
