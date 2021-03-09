export const InjectionTokens = {
    CONTAINER: Symbol.for('CONTAINER'),
    services: {
        telemetry: {
            TELEMETRY_SERVICE: Symbol.for('TELEMETRY_SERVICE'),
            PLAYER_TELEMETRY_SERVICE: Symbol.for('PLAYER_TELEMETRY_SERVICE')
        },
    }
};
