import {CsHttpService, CsResponse} from '../../../core/http-service/interface';
import {Container} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import { CsNotificationService} from '../interface';
import {of} from 'rxjs';
import { NotificationServiceImpl } from './notification-service-impl';

describe('DiscussionServiceImpl', () => {
    let notificationService: CsNotificationService;
    const mockHttpService: Partial<CsHttpService> = {};
    const mockApiPath = 'MOCK_API_PATH';

    beforeAll(() => {
        const container = new Container();

        container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE).toConstantValue(mockHttpService as CsHttpService);
        container.bind<string>(InjectionTokens.services.notification.NOTIFICATION_SERVICE_API_PATH).toConstantValue(mockApiPath);
        container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(container);
        container.bind<CsNotificationService>(InjectionTokens.services.notification.NOTIFICATION_SERVICE).to(NotificationServiceImpl).inSingletonScope();
        notificationService = container.get<CsNotificationService>(InjectionTokens.services.notification.NOTIFICATION_SERVICE);
    });

    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        expect(notificationService).toBeTruthy();
    });

    describe('notificationRead()', () => {
        it('should fetch all notifications with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {
                    result: {
                        feeds: [{type:'some-type'}]
                    }
                };
                return of(response);
            });

            notificationService.notificationRead('uid').subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'GET',
                }));
                expect(r).toEqual({
                    feeds: [{type:'some-type'}]
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should fetch all notifications with appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {
                        result: {
                            feeds: [{type:'some-type'}]
                        }
                    };
                    return of(response);
                });

                notificationService.notificationRead('uid', {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'GET',
                        path: '/some_api_path/read/uid'
                    }));
                    expect(r).toEqual({
                        feeds: [{type:'some-type'}]
                    });
                    done();
                });
            });
        });
    });

    describe('notificationUpdate()', () => {
        it('should be able update a notification with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {result: {
                    id: 'SOME_ID'
                }};
                return of(response);
            });

            const request = {
                ids: ['id1'],
            } as any;

            notificationService.notificationUpdate(request).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'PATCH',
                    body: {
                        request
                    }
                }));
                expect(r).toEqual({
                    id: 'SOME_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should be able to  update a notification appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {result: {
                        id: 'SOME_ID'
                    }};
                    return of(response);
                });

                const request = {
                    ids: ['id1'],
                } as any;

                notificationService.notificationUpdate(request, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'PATCH',
                        path: '/some_api_path/update',
                        body: {
                            request
                        }
                    }));
                    expect(r).toEqual({
                        id: 'SOME_ID'
                    });
                    done();
                });
            });
        });
    });

    describe('notificationDelete()', () => {
        it('should be able update a notification with appropriate request', (done) => {
            mockHttpService.fetch = jest.fn(() => {
                const response = new CsResponse();
                response.responseCode = 200;
                response.body = {result: {
                    id: 'SOME_ID'
                }};
                return of(response);
            });

            const request = {
                ids: ['id1'],
            } as any;

            notificationService.notificationDelete(request).subscribe((r) => {
                expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                    type: 'POST',
                    body: {
                        request
                    }
                }));
                expect(r).toEqual({
                    id: 'SOME_ID'
                });
                done();
            });
        });

        describe('when configuration is overridden', () => {
            it('should be able to  update a notification appropriate request', (done) => {
                mockHttpService.fetch = jest.fn(() => {
                    const response = new CsResponse();
                    response.responseCode = 200;
                    response.body = {result: {
                        id: 'SOME_ID'
                    }};
                    return of(response);
                });

                const request = {
                    ids: ['id1'],
                } as any;

                notificationService.notificationDelete(request, {apiPath: '/some_api_path'}).subscribe((r) => {
                    expect(mockHttpService.fetch).toHaveBeenCalledWith(expect.objectContaining({
                        type: 'POST',
                        path: '/some_api_path/delete',
                        body: {
                            request
                        }
                    }));
                    expect(r).toEqual({
                        id: 'SOME_ID'
                    });
                    done();
                });
            });
        });
    });

});
