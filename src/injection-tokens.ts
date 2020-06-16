export const InjectionTokens = {
    CONTAINER: Symbol.for('CONTAINER'),
    core: {
        HTTP_ADAPTER: Symbol.for('HTTP_ADAPTER'),
        global: {
            CHANNEL_ID: Symbol.for('CHANNEL_ID'),
            PRODUCER_ID: Symbol.for('PRODUCER_ID'),
            DEVICE_ID: Symbol.for('DEVICE_ID'),
        },
        api: {
            HOST: Symbol.for('HOST'),
            authentication: {
                USER_TOKEN: Symbol.for('USER_TOKEN'),
                MANAGED_USER_TOKEN: Symbol.for('MANAGED_USER_TOKEN'),
                BEARER_TOKEN: Symbol.for('BEARER_TOKEN'),
            }
        },
        HTTP_SERVICE: Symbol.for('HTTP_SERVICE'),
    },
    services: {
        group: {
            GROUP_SERVICE_API_PATH: Symbol.for('GROUP_SERVICE_API_PATH'),
            GROUP_SERVICE: Symbol.for('GROUP_SERVICE')
        },
        framework: {
            FRAMEWORK_SERVICE_API_PATH: Symbol.for('FRAMEWORK_SERVICE_API_PATH'),
            FRAMEWORK_SERVICE: Symbol.for('FRAMEWORK_SERVICE')
        },
        location: {
            LOCATION_SERVICE_API_PATH: Symbol.for('LOCATION_SERVICE_API_PATH'),
            LOCATION_SERVICE: Symbol.for('LOCATION_SERVICE')
        },
        course: {
            COURSE_SERVICE_API_PATH: Symbol.for('COURSE_SERVICE_API_PATH'),
            COURSE_SERVICE: Symbol.for('COURSE_SERVICE')
        }
    }
};
