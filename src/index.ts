import {Container} from 'inversify';
import {HttpClient} from './core/http-service/implementation/http-client-adapters/http-client';
import {HttpClientCordovaAdapter} from './core/http-service/implementation/http-client-adapters/http-client-cordova-adapter';
import {HttpClientBrowserAdapter} from './core/http-service/implementation/http-client-adapters/http-client-browser-adapter';
import {CsHttpService} from './core/http-service/interface';
import {HttpServiceImpl} from './core/http-service/implementation/http-service-impl';
import {ClassRoomServiceImpl} from './services/class-room/implementation/class-room-service-impl';
import {CsClassRoomService} from './services/class-room/interface';
import {InjectionTokens} from './injection-tokens';

export interface CsConfig {
    core: {
        httpAdapter: 'HttpClientBrowserAdapter' | 'HttpClientCordovaAdapter';
        api: {
            host: string;
            authentication: {
                userToken?: string;
                bearerToken?: string;
            };
        };
    };
}

export class CsModule {
    private static _instance?: CsModule;

    public static get instance(): CsModule {
        if (!CsModule._instance) {
            CsModule._instance = new CsModule();
        }

        return CsModule._instance;
    }

    private _container: Container;

    private _isInitialised = false;

    private _config: CsConfig;

    get isInitialised(): boolean {
        return this._isInitialised;
    }

    get classRoomService(): CsClassRoomService {
        return this._container.get<CsClassRoomService>(InjectionTokens.services.CLASS_ROOM_SERVICE);
    }

    get config(): CsConfig {
        return this._config;
    }

    public async init(config: CsConfig) {
        this._config = config;

        this._container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(this._container = new Container());

        if (config.core.httpAdapter === 'HttpClientCordovaAdapter') {
            this._container.bind<HttpClient>(InjectionTokens.core.api.authentication.BEARER_TOKEN)
                .to(HttpClientCordovaAdapter).inSingletonScope();
        } else {
            this._container.bind<HttpClient>(InjectionTokens.core.api.authentication.BEARER_TOKEN)
                .to(HttpClientBrowserAdapter).inSingletonScope();
        }

        this.updateConfig(config);

        this._container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE)
            .to(HttpServiceImpl).inSingletonScope();

        this._container.bind<CsClassRoomService>(InjectionTokens.services.CLASS_ROOM_SERVICE)
            .to(ClassRoomServiceImpl).inSingletonScope();

        this._isInitialised = true;
    }

    updateConfig(config: CsConfig) {
        this._config = config;

        this._container.bind<string>(InjectionTokens.core.api.HOST)
            .toConstantValue(config.core.api.host);
        this._container.bind<string | undefined>(InjectionTokens.core.api.authentication.BEARER_TOKEN)
            .toConstantValue(config.core.api.authentication.bearerToken);
        this._container.bind<string | undefined>(InjectionTokens.core.api.authentication.USER_TOKEN)
            .toConstantValue(config.core.api.authentication.userToken);
    }
}
