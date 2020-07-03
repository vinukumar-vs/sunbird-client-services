import {CsResponse} from '../interface';
import {CsError} from '../../cs-error';

export class CsHttpClientError extends CsError {
    private static code = 'HTTP_CLIENT_ERROR';

    constructor(message: string, public readonly response: CsResponse) {
        super(message, CsHttpClientError.code);

        Object.setPrototypeOf(this, CsHttpClientError.prototype);
    }

    static isInstance(obj: any): boolean {
        return obj['code'] && obj['code'] === CsHttpClientError.code;
    }
}
