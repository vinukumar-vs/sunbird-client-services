export abstract class PlayerTelemetryService {
    abstract onStartEvent(event, data);
    abstract onEndEvent(event, data);
    abstract onHeartBeatEvent(event, data);
    abstract onErrorEvent(event, data);
}
