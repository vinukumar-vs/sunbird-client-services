export const InjectionTokens = {
    CONTAINER: Symbol.for('CONTAINER'),
    core: {
        HTTP_ADAPTER: Symbol.for('HTTP_ADAPTER'),
        global: {
            headers: {
                CHANNEL_ID: Symbol.for('CHANNEL_ID'),
                PRODUCER_ID: Symbol.for('PRODUCER_ID'),
                DEVICE_ID: Symbol.for('DEVICE_ID'),
            }
        },
        api: {
            HOST: Symbol.for('HOST'),
            authentication: {
                USER_TOKEN: Symbol.for('USER_TOKEN'),
                BEARER_TOKEN: Symbol.for('BEARER_TOKEN'),
            }
        },
        HTTP_SERVICE: Symbol.for('HTTP_SERVICE'),
    },
    services: {
        CLASS_ROOM_SERVICE: Symbol.for('CLASS_ROOM_SERVICE')
    }
};