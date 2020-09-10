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
        if (event.edata.type === 'PAGE_CHANGE') {
            const length = event.metaData.duration.length > 0 ? event.metaData.duration.length - 1 : 0;
            const duration = event.metaData.duration[length];
            this.telemetryService.raiseImpressionTelemetry({
                edata: {
                        'type': 'workflow',
                        'subtype': '',
                        'pageid': event.edata.currentPage + '',
                        'uri': '1',
                        'duration': Number((duration / 1000).toFixed(2))
                }
            });
        }
    }
}
