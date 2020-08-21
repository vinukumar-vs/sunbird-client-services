import {CsResponse} from '../interface';
import {CsError} from '../../cs-error';

export class CsHttpServerError extends CsError {
    private static code = 'HTTP_SERVER_ERROR';

    constructor(message: string, public readonly response: CsResponse) {
        super(message, CsHttpServerError.code);

        Object.setPrototypeOf(this, CsHttpServerError.prototype);
    }

    static isInstance(obj: any): boolean {
        return obj['code'] && obj['code'] === CsHttpServerError.code;
    }
}
