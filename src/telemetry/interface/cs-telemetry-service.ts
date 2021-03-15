import {IActor, ICDataEntry, IProducerdata, ITelemetryObject} from './cs-telemetry-request';

export abstract class TelemetryService {
    public abstract initTelemetry(telemetryConfig: any);
    public abstract raiseInteractTelemetry(interactObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject);
    public abstract raiseImpressionTelemetry(interactObject);
    public abstract raiseImpressionTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject);
    public abstract raiseLogTelemetry(logObject);
    public abstract raiseLogTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject);
    public abstract raiseErrorTelemetry(errorObject);
    public abstract raiseErrorTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject);
    public abstract raiseAuditTelemetry(auditObject);
    public abstract raiseAuditTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject);
    public abstract raiseStartTelemetry(startEventObject);
    public abstract raiseEndTelemetry(startEventObject);
    public abstract raiseEndTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject);
    public abstract raiseShareTelemetry(shareEventObject);
    public abstract raiseShareTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject);
    public abstract raiseFeedBackTelemetry(feedbackEventObject);
    public abstract raiseFeedBackTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject);
    public abstract setTelemetryAttributes(pdata: IProducerdata, actor: IActor, channel: string , sid: string, did: string);
    public abstract raiseAssesTelemetry(data: any , options: any);
}
