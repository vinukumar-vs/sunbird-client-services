import {CsError} from '../../cs-error';

export class CsNetworkError extends CsError {
    constructor(message: string) {
        super(message, 'NETWORK_ERROR');

        Object.setPrototypeOf(this, CsNetworkError.prototype);
    }
}
