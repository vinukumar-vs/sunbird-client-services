import {PlayerTelemetryService, TelemetryService} from '../interface';
import {injectable} from 'inversify';

@injectable()
export class PlayerTelemetryServiceImpl implements PlayerTelemetryService {
    constructor(
        protected telemetryService: TelemetryService
    ) {
    }

    onStartEvent(event: any, data: any) {
        console.log(event);
        const startEvent = {
                options: {
                    object: {
                        id: data.id,
                        ver: data.ver
                    }
                },
            context: {
                env: 'ContentPlayer'
            },
            edata: {
                'type': 'content',
                'mode': 'play',
                'pageid': '',
                'duration':  Number((event.edata.duration / 1000).toFixed(2))
            }
        }
    ;
        this.telemetryService.raiseStartTelemetry(startEvent);
    }

    onEndEvent(event: any, data: any) {
        const endEvent = {
            edata: {
            'type': 'content',
            'mode': 'play',
            'pageid': 'sunbird-player-Endpage',
            'summary': [
              {
                'numberOfPagesVisited': event.numberOfPagesVisited
              },
              {
                'duration': event.duration
              },
              {
                'zoom': event.zoom
              },
              {
                'rotation': event.rotation
              },
              {
                'totalseekedlength': 193
              },
              {
                'endpageseen': true
              }
            ],
            'duration': Number((event.edata.duration / 1000).toFixed(2))
          } };
       this.telemetryService.raiseEndTelemetry(endEvent);
    }

    onErrorEvent(event: any, data: any) {
        console.log(event);
       // this.telemetryService.raiseErrorTelemetry({});
    }

    onHeartBeatEvent(event, data?) {
        if (event.type === 'LOADED') {

        } else if (event.type === 'PLAY') {

        } else {
            this.telemetryService.raiseLogTelemetry({});
        }
    }
}
