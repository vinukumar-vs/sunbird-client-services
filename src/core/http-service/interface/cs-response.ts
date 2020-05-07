export enum CsHttpResponseCode {
    HTTP_UNAUTHORISED = 401,
    HTTP_FORBIDDEN = 403,
    HTTP_SUCCESS = 200,
    HTTP_BAD_REQUEST = 400
}

export class CsResponse<T = any> {

    private _responseCode: CsHttpResponseCode;
    private _errorMesg: string;
    private _body: T;


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
}
