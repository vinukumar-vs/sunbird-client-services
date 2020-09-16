import {PlayerTelemetryService, TelemetryService} from '../interface';
import {injectable} from 'inversify';

@injectable()
export class PlayerTelemetryServiceImpl implements PlayerTelemetryService {
    constructor(
        protected telemetryService: TelemetryService
    ) {
    }

    onStartEvent(event: any, data: any) {

    }

    onEndEvent(event: any, data: any) {
    }

    onErrorEvent(event: any, data: any) {
    }

    onHeartBeatEvent(event, data?) {
        if (event.type === 'LOADED') {

        } else if (event.type === 'PLAY') {

        } else {
            this.telemetryService.raiseLogTelemetry({});
        }
    }
}
