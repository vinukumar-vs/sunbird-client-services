import {Container} from 'inversify';
import {HttpClient} from './core/http-service/implementation/http-client-adapters/http-client';
import {HttpClientCordovaAdapter} from './core/http-service/implementation/http-client-adapters/http-client-cordova-adapter';
import {HttpClientBrowserAdapter} from './core/http-service/implementation/http-client-adapters/http-client-browser-adapter';
import {CsHttpService} from './core/http-service/interface/cs-http-service';
import {HttpServiceImpl} from './core/http-service/implementation/http-service-impl';
import {ClassRoomServiceImpl} from './services/class-room/implementation/class-room-service-impl';
import {ScClassRoomService} from './services/class-room/interface';
import {InjectionTokens} from './injection-tokens';

export interface CsConfig {
    core: {
        httpAdapter: 'HttpClientBrowserAdapter' | 'HttpClientCordovaAdapter';
        api: {
            host: string;
            authentication: {
                userToken: string;
                bearerToken: string;
            };
        };
    };
}

class CsModule {
    private static _instance?: CsModule;

    public static get instance(): CsModule {
        if (!CsModule._instance) {
            CsModule._instance = new CsModule();
        }

        return CsModule._instance;
    }

    private _container: Container;

    private _isInitialised = false;

    get isInitialised(): boolean {
        return this._isInitialised;
    }

    get classRoomService(): ScClassRoomService {
        return this._container.get<ScClassRoomService>(InjectionTokens.services.CLASS_ROOM_SERVICE);
    }

    public async init(config: CsConfig) {
        this._container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(this._container = new Container());

        if (config.core.httpAdapter === 'HttpClientCordovaAdapter') {
            this._container.bind<HttpClient>(InjectionTokens.core.api.authentication.BEARER_TOKEN)
                .to(HttpClientCordovaAdapter).inRequestScope();
        } else {
            this._container.bind<HttpClient>(InjectionTokens.core.api.authentication.BEARER_TOKEN)
                .to(HttpClientBrowserAdapter).inRequestScope();
        }

        console.assert(!!config.core.api.authentication.bearerToken);
        this._container.bind<string>(InjectionTokens.core.api.authentication.BEARER_TOKEN)
            .toConstantValue(config.core.api.authentication.bearerToken);
        console.assert(!!config.core.api.authentication.userToken);
        this._container.bind<string>(InjectionTokens.core.api.authentication.USER_TOKEN)
            .toConstantValue(config.core.api.authentication.userToken);

        this._container.bind<CsHttpService>(InjectionTokens.core.HTTP_SERVICE)
            .to(HttpServiceImpl).inRequestScope();

        this._container.bind<ScClassRoomService>(InjectionTokens.services.CLASS_ROOM_SERVICE)
            .to(ClassRoomServiceImpl).inRequestScope();

        this._isInitialised = true;
    }
}
