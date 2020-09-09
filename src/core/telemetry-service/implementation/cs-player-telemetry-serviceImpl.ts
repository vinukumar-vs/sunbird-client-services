import { PlayerTelemetryService } from '../interface/cs-player-telemetry-service';
import { TelemetryService } from '../interface/cs-telemetry-service';

export class PlayerTelemetryServiceImpl implements PlayerTelemetryService {

    telemetryService: TelemetryService;

    onStartEvent(event: any, data: any) {
        this.telemetryService.raiseStartTelemetry({});
    }

    onEndEvent(event: any, data: any) {
        this.telemetryService.raiseStartTelemetry({});
    }

    onErrorEvent(event: any, data: any) {
        this.telemetryService.raiseErrorTelemetry({});
    }

    onHeartBeatEvent(event, data?) {
        if (event.type === 'LOADED') {

        } else if (event.type === 'PLAY') {

        } else {
            this.telemetryService.raiseLogTelemetry({});
        }
    }
}
