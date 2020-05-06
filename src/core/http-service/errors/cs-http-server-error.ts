import {CsResponse} from '../interface/cs-response';
import {CsError} from '../../cs-error';

export class CsHttpServerError extends CsError {
    constructor(message: string, public readonly response: CsResponse) {
        super(message, 'HTTP_SERVER_ERROR');

        Object.setPrototypeOf(this, CsHttpServerError.prototype);
    }
}
