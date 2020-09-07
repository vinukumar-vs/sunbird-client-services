import {ICDataEntry, ITelemetryObject, IProducerdata, IActor} from '../interface/cs-telemetry-request';

export abstract class TelemetryService {
    public abstract initTelemetry(telemetryConfig:any);
    public abstract raiseInteractTelemetry(interactObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract raiseImpressionTelemetry(interactObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract raiseLogTelemetry(logObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract raiseErrorTelemetry(errorObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract raiseAuditTelemetry(auditObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract raiseStartTelemetry(startEventObject);
    public abstract raiseEndTelemetry(startEventObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract raiseShareTelemetry(shareEventObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract raiseFeedBackTelemetry(feedbackEventObject);
    public abstract raiseInteractTelemetryWith(cdata: Array<ICDataEntry>,env: String,edata: any,telemetryObject?: ITelemetryObject);
    public abstract setTelemetryAttributes(pdata:IProducerdata, actor:IActor, channel:string , sid:string, did:string);
}