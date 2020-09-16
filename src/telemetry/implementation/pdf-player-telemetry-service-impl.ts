import {PlayerTelemetryServiceImpl} from './player-telemetry-service-impl';
import {inject, injectable} from 'inversify';
import {TelemetryService} from '../interface';
import {InjectionTokens} from '../injection-tokens';

@injectable()
export class PdfPlayerTelemetryServiceImpl extends PlayerTelemetryServiceImpl {
    constructor(
        @inject(InjectionTokens.services.telemetry.TELEMETRY_SERVICE) telemetryService: TelemetryService
    ) {
        super(telemetryService);
    }

    onHeartBeatEvent(event: any, data: any) {

    }
}
