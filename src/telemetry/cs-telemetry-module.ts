import {Container} from 'inversify';
import {PlayerTelemetryService, TelemetryService} from './interface';
import {TelemetryServiceImpl} from './implementation/telemetry-service-Impl';
import {InjectionTokens} from './injection-tokens';
import {PdfPlayerTelemetryServiceImpl} from './implementation/pdf-player-telemetry-service-impl';

export interface CsTelemetryConfig {
    ver?: string;
    pdata?: {
        id?: string;
        pid?: string;
        ver?: string;
    };
    actor?: { // Override
        type?: string;
        id?: string;
    };
    channel?: ''; // Overridable
    context?: {
        sid?: string;
        did?: string;
    };
}

export class CsTelemetryModule {
    private _container: Container;
    private onUpdateConfigCallback?: () => void;

    // tslint:disable-next-line:member-ordering
    private static _instance?: CsTelemetryModule;

    public static get instance(): CsTelemetryModule {
        if (!CsTelemetryModule._instance) {
            CsTelemetryModule._instance = new CsTelemetryModule();
        }

        return CsTelemetryModule._instance;
    }

    private _isInitialised = false;

    get isInitialised(): boolean {
        return this._isInitialised;
    }

    get telemetryService(): TelemetryService {
        return this._container.get<TelemetryService>(InjectionTokens.services.telemetry.TELEMETRY_SERVICE);
    }

    get playerTelemetryService(): PlayerTelemetryService {
        return this._container.get<PlayerTelemetryService>(InjectionTokens.services.telemetry.PLAYER_TELEMETRY_SERVICE);
    }

    public async init(config: CsTelemetryConfig) {
        this._container = new Container();

        this._container.bind<Container>(InjectionTokens.CONTAINER).toConstantValue(this._container);

        this.initOrUpdateServices();

        this._isInitialised = true;
    }

    initOrUpdateServices() {
        this._container.bind<TelemetryService>(InjectionTokens.services.telemetry.TELEMETRY_SERVICE)
            .to(TelemetryServiceImpl).inSingletonScope();

        this._container.bind<PlayerTelemetryService>(InjectionTokens.services.telemetry.PLAYER_TELEMETRY_SERVICE)
            .to(PdfPlayerTelemetryServiceImpl).inSingletonScope();
    }
}
