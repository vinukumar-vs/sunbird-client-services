import {CsError} from '../../cs-error';

export class NetworkError extends CsError {
    constructor(message: string) {
        super(message, 'NETWORK_ERROR');

        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}
