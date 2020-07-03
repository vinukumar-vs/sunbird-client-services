import {CsError} from '../../cs-error';

export class CsNetworkError extends CsError {
    private static code = 'NETWORK_ERROR';

    constructor(message: string) {
        super(message, CsNetworkError.code);

        Object.setPrototypeOf(this, CsNetworkError.prototype);
    }

    static isInstance(obj: any): boolean {
        return obj['code'] && obj['code'] === CsNetworkError.code;
    }
}
