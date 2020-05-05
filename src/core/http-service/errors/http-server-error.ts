import {Response} from '../interface/response';
import {CsError} from '../../cs-error';

export class HttpServerError extends CsError {
    constructor(message: string, public readonly response: Response) {
        super(message, 'HTTP_SERVER_ERROR');

        Object.setPrototypeOf(this, HttpServerError.prototype);
    }
}
