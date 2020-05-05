import {Response} from '../interface/response';
import {CsError} from '../../cs-error';

export class HttpClientError extends CsError {
    constructor(message: string, public readonly response: Response) {
        super(message, 'HTTP_CLIENT_ERROR');

        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}