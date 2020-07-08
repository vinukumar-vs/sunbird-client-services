import {CsModule} from './cs-module';

describe('CsModule', () => {
    it('should be able to instantiate CsModule with base configuration', async (done) => {
        if (!CsModule.instance.isInitialised) {
            await CsModule.instance.init({
                core: {
                    httpAdapter: 'HttpClientCordovaAdapter',
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
                        apiPath: '/api/course/v1'
                    },
                    groupServiceConfig: {
                        apiPath: '/api/group/v1'
                    },
                }
            });
        }

        expect(CsModule.instance).toBeTruthy();

        done();
    });
});
