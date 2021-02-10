import {CsResponseInterceptor} from './cs-response-interceptor';
import {CsRequestInterceptor} from './cs-request-interceptor';
import {CsRequestBuilderError} from '../errors/cs-request-builder-error';

export enum CsHttpSerializer {
    JSON = 'json',
    URLENCODED = 'urlencoded',
    UTF8 = 'utf8',
    RAW = 'raw'
}

export enum CsHttpRequestType {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    DELETE = 'DELETE',
    PUT = 'PUT'
}

export interface CsSerializedRequest {
    type: CsHttpRequestType;
    host: string | undefined;
    path: string;
    serializer: CsHttpSerializer;
    withBearerToken: boolean;
    withUserToken: boolean;
    headers: {[key: string]: string};
    body: {[key: string]: string} | string;
    parameters: {[key: string]: string};
}

export class CsRequest {
    static fromJSON(json: Partial<CsSerializedRequest>): CsRequest {
        const builder = new CsRequest.Builder();
        /* istanbul ignore else */
        if (json.body) { builder.withBody(json.body); }
        /* istanbul ignore else */
        if (json.type) { builder.withType(json.type); }
        /* istanbul ignore else */
        if (json.host) { builder.withHost(json.host); }
        /* istanbul ignore else */
        if (json.path) { builder.withPath(json.path); }
        /* istanbul ignore else */
        if (json.serializer) { builder.withSerializer(json.serializer); }
        /* istanbul ignore else */
        if (json.withBearerToken) { builder.withBearerToken(json.withBearerToken); }
        /* istanbul ignore else */
        if (json.withUserToken) { builder.withUserToken(json.withUserToken); }
        /* istanbul ignore else */
        if (json.headers) { builder.headers(json.headers); }
        /* istanbul ignore else */
        if (json.parameters) { builder.withParameters(json.parameters); }
        return builder.build();
    }

    static Builder: any = class Builder {

        protected request: CsRequest;

        constructor() {
            this.request = new CsRequest();
        }

        withHost(host: string) {
            this.request._host = host;
            return this;
        }

        withPath(path: string) {
            this.request._path = path;
            return this;
        }

        withType(type: CsHttpRequestType) {
            this.request._type = type;
            return this;
        }

        withResponseInterceptor(responseInterceptor: CsResponseInterceptor) {
            this.request._responseInterceptors.push(responseInterceptor);
            return this;
        }

        withRequestInterceptor(requestInterceptor: CsRequestInterceptor) {
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

        withSerializer(serializer: CsHttpSerializer) {
            this.request._serializer = serializer;
            return this;
        }

        build(): CsRequest {
            if (!this.request._path) {
                throw new CsRequestBuilderError('withPath() is required');
            }

            if (!this.request._type) {
                throw new CsRequestBuilderError('withType() is required');
            }

            return this.request;
        }

    };

    private _host?: string;
    private _serializer: CsHttpSerializer = CsHttpSerializer.JSON;
    private _responseInterceptors: CsResponseInterceptor[] = [];
    private _withBearerToken = false;
    private _path: string;
    private _type: CsHttpRequestType;

    get serializer(): CsHttpSerializer {
        return this._serializer;
    }

    set serializer(value: CsHttpSerializer) {
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

    get type(): CsHttpRequestType {
        return this._type;
    }

    set responseInterceptors(value: Array<CsResponseInterceptor>) {
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

    set type(value: CsHttpRequestType) {
        this._type = value;
    }

    get responseInterceptors(): Array<CsResponseInterceptor> {
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

    private _requestInterceptors: CsRequestInterceptor[] = [];

    get requestInterceptors(): CsRequestInterceptor[] {
        return this._requestInterceptors;
    }

    get host(): string | undefined {
        return this._host;
    }

    toJSON(): string {
        return JSON.stringify({
            body: this._body,
            type: this._type,
            host: this._host,
            path: this._path,
            serializer: this._serializer,
            withBearerToken: this._withBearerToken,
            withUserToken: this._withUserToken,
            headers: this._headers,
            parameters: this._parameters,
        } as CsSerializedRequest);
    }
}
