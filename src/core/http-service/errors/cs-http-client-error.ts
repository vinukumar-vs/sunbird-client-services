import {CsResponse} from '../interface/cs-response';
import {CsError} from '../../cs-error';

export class CsHttpClientError extends CsError {
    constructor(message: string, public readonly response: CsResponse) {
        super(message, 'HTTP_CLIENT_ERROR');

        Object.setPrototypeOf(this, CsHttpClientError.prototype);
    }
}