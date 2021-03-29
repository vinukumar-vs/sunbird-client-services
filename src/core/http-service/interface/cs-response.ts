export enum CsHttpResponseCode {
    HTTP_UNAUTHORISED = 401,
    HTTP_FORBIDDEN = 403,
    HTTP_SUCCESS = 200,
    HTTP_BAD_REQUEST = 400,
    HTTP_KONG_FAILURE = 447,
    HTTP_INTERNAL_SERVER_ERROR = 500,
}

export class CsResponse<T = any> {

    private _responseCode: CsHttpResponseCode;
    private _errorMesg: string;
    private _body: T;
    private _headers: any;


    get responseCode(): CsHttpResponseCode {
        return this._responseCode;
    }

    set responseCode(value: CsHttpResponseCode) {
        this._responseCode = value;
    }

    get errorMesg(): string {
        return this._errorMesg;
    }

    set errorMesg(value: string) {
        this._errorMesg = value;
    }

    get body(): T {
        return this._body;
    }

    set body(value: T) {
        this._body = value;
    }

    get headers(): any {
        return this._headers;
    }

    set headers(value: any) {
        this._headers = value;
    }

    toJSON(): string {
        return JSON.stringify({
            responseCode: this._responseCode,
            errorMesg: this._errorMesg,
            body: this._body,
            headers: this._headers,
        });
    }
}
