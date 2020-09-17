import {CsModule} from './cs-module';

describe('CsModule', () => {
    it('should be able to instantiate CsModule with base configuration', async (done) => {
        if (!CsModule.instance.isInitialised) {
            await CsModule.instance.init({
                core: {
                    httpAdapter: 'HttpClientBrowserAdapter',
                    global: {
                        channelId: 'SAMPLE_CHANNEL_ID',
                        producerId: 'SAMPLE_PRODUCER_ID',
                        deviceId: 'SAMPLE_DEVICE_ID'
                    },
                    api: {
                        host: 'SAMPLE_HOST',
                        authentication: {}
                    }
                },
                services: {
                    courseServiceConfig: {
                        apiPath: '/api/course/v1',
                        certRegistrationApiPath: '/api/certreg/v1'
                    },
                    groupServiceConfig: {
                        apiPath: '/api/group/v1',
                        dataApiPath: '/api/data/v1/group/activity/agg',
                    },
                    formServiceConfig: {
                        apiPath: '/api/data/v1/form'
                    }
                }
            });
        }

        expect(CsModule.instance).toBeTruthy();

        done();
    });

    describe('CsGroupService', () => {
        it('should be able to access groupService singleton', () => {
            expect(CsModule.instance.groupService).toBeTruthy();
        });


        it('should be able to access activity service from groupService', () => {
            expect(CsModule.instance.groupService.activityService).toBeTruthy();
        });
    });
});
