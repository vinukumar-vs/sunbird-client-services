import { TelemetryService } from "../interface/cs-telemetry-service";
import { ITelemetry, ITelemetryContext, IProducerdata } from "../interface/cs-telemetry-request";

let EkTelemetry;
export class TelemetryServiceImpl implements TelemetryService {

    
    _isInitialsed:boolean = false;
    telemetryProvider:any;
    context: ITelemetryContext;
    pData: IProducerdata;


    public initTelemetry(telemetryContext: ITelemetryContext) {
        this.telemetryProvider = EkTelemetry;
        this._isInitialsed = true;
        this.telemetryProvider.initialize(telemetryContext.config);
    }  
    public initTelmetry() {
        if(this.context!=null) {
            this.telemetryProvider.initialize(this.context.config);
        } else {
            let context:ITelemetryContext ;
            let config:ITelemetry;
            
        }
    }  
    public formulateBasicConfigForTelemetry() {

    }
    public initProducerData( version? : String, app? : String, ) {
        if(this.pData) {
            return this.pData;
        } else {

        }
        
    }
    private isTelemetryInitialised() {
        return this._isInitialsed;
    }
    public raiseInteractTelemetry(interactObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.interact(interactObject.edata, interactObject.options);
        }
    }
    public raiseImpressionTelemetry(impressionObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.impression(impressionObject.edata, impressionObject.options);
        }
    }
    public raiseLogTelemetry(logObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.log(logObject.edata, logObject.options);
        }
    }
    public raiseErrorTelemetry(errorObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.log(errorObject.edata, errorObject.options);
        }
    }
    public raiseAuditTelemetry(auditObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.audit(auditObject.edata, auditObject.options);
        }
    }
    public raiseStartTelemetry(startEventObject: any) {
        throw new Error("Method not implemented.");
    }
    public raiseEndTelemetry(endEventObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.end(endEventObject.edata, endEventObject.options);
        }
    }
    public raiseShareTelemetry(shareEventObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.share(shareEventObject.edata, shareEventObject.options);
        }
    }
    public raiseFeedBackTelemetry(feedbackEventObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.share(feedbackEventObject.edata, feedbackEventObject.options);
        }
    }
}