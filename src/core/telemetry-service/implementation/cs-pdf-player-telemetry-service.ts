import { PlayerTelemetryServiceImpl } from "./cs-player-telemetry-serviceImpl";

export class CSPDFPlayerTelemetryService extends PlayerTelemetryServiceImpl {

    onHeartBeatEvent(event: any, data: any) {
        throw new Error("Method not implemented.");
    }
}