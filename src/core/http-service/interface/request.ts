import {ResponseInterceptor} from './response-interceptor';
import {RequestInterceptor} from './request-interceptor';
import {RequestBuildError} from '../errors/request-build-error';

export enum HttpSerializer {
    JSON = 'json',
    URLENCODED = 'urlencoded',
    UTF8 = 'utf8',
    RAW = 'raw'
}

export enum HttpRequestType {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH'
}

export class Request {
    static Builder: any = class Builder {

        protected request: Request;

        constructor() {
            this.request = new Request();
        }

        withHost(host: string) {
            this.request._host = host;
            return this;
        }

        withPath(path: string) {
            this.request._path = path;
            return this;
        }

        withType(type: HttpRequestType) {
            this.request._type = type;
            return this;
        }

        withResponseInterceptor(responseInterceptor: ResponseInterceptor) {
            this.request._responseInterceptors.push(responseInterceptor);
            return this;
        }

        withRequestInterceptor(requestInterceptor: RequestInterceptor) {
            this.request._requestInterceptors.push(requestInterceptor);
            return this;
        }

        withHeaders(headers: { [key: string]: string }) {
            this.request._headers = headers;
            return this;
        }

        withBody(body: {}) {
            this.request._body = body;
            return this;
        }

        withParameters(parameters: { [key: string]: string }) {
            this.request._parameters = parameters;
            return this;
        }

        withBearerToken(required: boolean) {
            this.request.withBearerToken = required;
            return this;
        }

        withUserToken(required: boolean) {
            this.request.withUserToken = required;
            return this;
        }

        withSerializer(serializer: HttpSerializer) {
            this.request._serializer = serializer;
            return this;
        }

        build(): Request {
            if (!this.request._path) {
                throw new RequestBuildError('withPath() is required');
            }

            if (!this.request._type) {
                throw new RequestBuildError('withType() is required');
            }

            return this.request;
        }

    };

    private _host?: string;
    private _serializer: HttpSerializer = HttpSerializer.JSON;
    private _responseInterceptors: ResponseInterceptor[] = [];
    private _withBearerToken = false;
    private _path: string;
    private _type: HttpRequestType;

    get serializer(): HttpSerializer {
        return this._serializer;
    }

    set serializer(value: HttpSerializer) {
        this._serializer = value;
    }

    get withBearerToken(): boolean {
        return this._withBearerToken;
    }

    set withBearerToken(value: boolean) {
        this._withBearerToken = value;
    }
    private _headers?: { [key: string]: string } = {};
    private _body?: {} = {};
    private _parameters?: { [key: string]: string } = {};

    get body(): {} {
        return this._body!;
    }

    protected constructor() {

    }

    private _withUserToken = false;

    set path(value: string) {
        this._path = value;
    }

    get type(): HttpRequestType {
        return this._type;
    }

    set responseInterceptors(value: Array<ResponseInterceptor>) {
        this._responseInterceptors = value;
    }

    set headers(value: { [p: string]: string }) {
        this._headers = value;
    }

    set body(value: {}) {
        this._body = value;
    }

    get path(): string {
        return this._path;
    }

    set type(value: HttpRequestType) {
        this._type = value;
    }

    get responseInterceptors(): Array<ResponseInterceptor> {
        return this._responseInterceptors;
    }

    get headers(): { [p: string]: string } {
        return this._headers!;
    }

    get parameters(): { [key: string]: string } {
        return this._parameters!;
    }

    set parameters(value: { [key: string]: string }) {
        this._parameters = value;
    }

    get withUserToken(): boolean {
        return this._withUserToken;
    }

    set withUserToken(value: boolean) {
        this._withUserToken = value;
    }

    private _requestInterceptors: RequestInterceptor[] = [];

    get requestInterceptors(): RequestInterceptor[] {
        return this._requestInterceptors;
    }

    get host(): string | undefined {
        return this._host;
    }
}
