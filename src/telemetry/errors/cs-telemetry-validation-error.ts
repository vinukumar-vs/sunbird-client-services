import {CsError} from '../../core/cs-error';

export class CsTelemetryError extends CsError {
    private static code = 'TELEMETRY_VALIDATION_ERROR';

    constructor(message: string) {
        super(message, CsTelemetryError.code);

        Object.setPrototypeOf(this, CsTelemetryError.prototype);
    }

    static isInstance(obj: any): boolean {
        return obj['code'] && obj['code'] === CsTelemetryError.code;
    }
}
