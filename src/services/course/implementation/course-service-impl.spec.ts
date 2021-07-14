import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {ContentState, ContentStateScore, ContentStateStatus, CsCourseService} from '../interface';
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

    describe('getContentState()', () => {
        it('should invoke appropriate API call', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        contentList: []
                    }
                };
                return of(response);
            });

            const request = {
                userId: 'SOME_USER_ID',
                courseId: 'SOME_COURSE_ID',
                batchId: 'SOME_BATCH_ID',
                contentIds: [],
                fields: ['progress'] as ('progress' | 'score')[]
            };

            courseService.getContentState(request, {apiPath: '/some_overridden_path'}).subscribe(() => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    path: '/some_overridden_path/content/state/read',
                    body: {
                        request
                    }
                }));
                done();
            });
        });

        describe('when requesting score', () => {
            it('should return bestScore for content when scores available', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            contentList: [
                                {
                                    id: 'CONTENT_STATE_ID_0',
                                } as Partial<ContentState> as ContentState,
                                {
                                    id: 'CONTENT_STATE_ID_1',
                                    score: [],
                                } as Partial<ContentState> as ContentState,
                                {
                                    id: 'CONTENT_STATE_ID_2',
                                    status: ContentStateStatus.COMPLETED,
                                    score: [
                                        {
                                            attemptId: 'ATTEMPT_ID_1',
                                            lastAttemptedOn: (new Date()).toISOString(),
                                            totalMaxScore: 10,
                                            totalScore: 10
                                        }
                                    ],
                                } as Partial<ContentState> as ContentState,
                                {
                                    id: 'CONTENT_STATE_ID_2',
                                    status: ContentStateStatus.IN_PROGRESS,
                                    score: [
                                        {
                                            attemptId: 'ATTEMPT_ID_2',
                                            lastAttemptedOn: (new Date()).toISOString(),
                                            totalMaxScore: 10,
                                            totalScore: 10
                                        },
                                        {
                                            attemptId: 'ATTEMPT_ID_3',
                                            lastAttemptedOn: (new Date()).toISOString(),
                                            totalMaxScore: 10,
                                            totalScore: 20
                                        }
                                    ],
                                } as Partial<ContentState> as ContentState,
                            ]
                        }
                    };
                    return of(response);
                });

                const request = {
                    userId: 'SOME_USER_ID',
                    courseId: 'SOME_COURSE_ID',
                    batchId: 'SOME_BATCH_ID',
                    contentIds: [],
                    fields: ['progress', 'score'] as ('progress' | 'score')[]
                };

                courseService.getContentState(request, {apiPath: '/some_overridden_path'}).subscribe((r) => {
                    expect(r.map((c) => c.bestScore)).toEqual([
                        undefined,
                        undefined,
                        expect.objectContaining({
                            attemptId: 'ATTEMPT_ID_1',
                            lastAttemptedOn: expect.any(String),
                            totalMaxScore: 10,
                            totalScore: 10
                        }),
                        expect.objectContaining({
                            attemptId: 'ATTEMPT_ID_3',
                            lastAttemptedOn: expect.any(String),
                            totalMaxScore: 10,
                            totalScore: 20
                        })
                    ]);
                    done();
                });
            });
        });

        describe('updateContentState()', () => {
            it('should updateContentState', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            response: 'SUCCESS'
                        }
                    };
                    return of(response);
                });

                const request = {
                    userId: 'SOME_USER_ID',
                    courseId: 'SAMPLE_COURSE_ID',
                    batchId: 'SAMPLE_BATCH_ID'
                };

                courseService.updateContentState(request).subscribe(() => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'PATCH',
                        body: {
                            request
                        }
                    }));
                    done();
                });
            });

            describe('when optional configuration is passed', () => {
                it('should invoke updateContentState  with overridden apiPath', (done) => {
                    mockHttpService.fetch = jest.fn(() => {
                        const response = new CsResponse();
                        response.responseCode = 200;
                        response.body = {
                            result: {
                                response: 'SUCCESS'
                            }
                        };
                        return of(response);
                    });

                    const request = {
                        userId: 'SOME_USER_ID',
                        courseId: 'SAMPLE_COURSE_ID',
                        batchId: 'SAMPLE_BATCH_ID'
                    };

                    courseService.updateContentState(request, {apiPath: '/some_overridden_path'}).subscribe(() => {
                        expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                            type: 'PATCH',
                            path: '/some_overridden_path/content/state/update',
                            body: {
                                request
                            }
                        }));
                        done();
                    });
                });
            });
        });
    });
});
