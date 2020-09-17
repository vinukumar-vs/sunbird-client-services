import {IActor, ICDataEntry, IProducerdata, ITelemetryObject} from '../interface/cs-telemetry-request';

export abstract class TelemetryService {
    public abstract initTelemetry(telemetryConfig:any);
    public abstract raiseInteractTelemetry(interactObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract raiseImpressionTelemetry(interactObject);
    public abstract raiseLogTelemetry(logObject);
    public abstract raiseErrorTelemetry(errorObject);
    public abstract raiseAuditTelemetry(auditObject);
    public abstract raiseStartTelemetry(startEventObject);
    public abstract raiseEndTelemetry(startEventObject);
    public abstract raiseShareTelemetry(shareEventObject);
    public abstract raiseFeedBackTelemetry(feedbackEventObject);
    public abstract setTelemetryAttributes(pdata:IProducerdata, actor:IActor, channel:string , sid:string, did:string);
}