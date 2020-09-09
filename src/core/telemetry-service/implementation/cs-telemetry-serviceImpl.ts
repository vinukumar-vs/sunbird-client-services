import { TelemetryService } from '../interface/cs-telemetry-service';
import { ITelemetry, ITelemetryContext, IProducerdata, IActor, IContext, ICDataEntry, ITelemetryObject } from "../interface/cs-telemetry-request";
import * as EkTelemetry from '@project-sunbird/telemetry-sdk';
import { injectable } from 'inversify';

@injectable()
export class TelemetryServiceImpl implements TelemetryService {

    // tslint:disable-next-line:no-inferrable-types
    _isInitialsed: boolean = false;
    telemetryProvider: any;
    context: ITelemetryContext;
    pData: IProducerdata;
    actor: IActor;
    config: ITelemetry;
    public raiseEndTelemetryWith(cdata: ICDataEntry[], env: string, edata: any, telemetryObject?: ITelemetryObject | undefined) {
        throw new Error('Method not implemented.');
    }


    public initTelemetry(telemetryContext: ITelemetryContext) {
        this.telemetryProvider = EkTelemetry;
        this._isInitialsed = true;
        this.telemetryProvider.initialize(telemetryContext.config);
    }
    public initTelmetry(pdata: IProducerdata, actor: IActor, channel: string , sid: string, did: string) {
        if (this.context != null) {
            this.telemetryProvider.initialize(this.context.config);
        } else {
            this.config.pdata = pdata;
            this.config.channel = channel;
            this.config.did = did;
            this.config.sid = sid;
            this.actor = actor;
        }
    }
    public setTelemetryAttributes(pdata: IProducerdata, actor: IActor, channel: string , sid: string, did: string) {
        this.config.pdata = pdata;
        this.config.channel = channel;
        this.config.did = did;
        this.config.sid = sid;
        this.actor = actor;
   }
    public formulateBasicConfigForTelemetry() {

    }
    public initProducerData( pdata: IProducerdata ) {
        if (this.pData) {
            return this.pData;
        } else {
            this.config.pdata = pdata;
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
    public raiseInteractTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject) {

    }
    public raiseImpressionTelemetry(impressionObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.impression(impressionObject.edata, impressionObject.options);
        }
    }
    public raiseImpressionTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject) {

    }
    public raiseLogTelemetry(logObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.log(logObject.edata, logObject.options);
        }
    }
    public raiseLogTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject) {

    }
    public raiseErrorTelemetry(errorObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.log(errorObject.edata, errorObject.options);
        }
    }
    public raiseErrorTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject) {

    }
    public raiseAuditTelemetry(auditObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.audit(auditObject.edata, auditObject.options);
        }
    }
    public raiseAuditTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject) {

    }
    public raiseStartTelemetry(startEventObject: any) {
        throw new Error('Method not implemented.');
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
    public raiseShareTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject) {

    }
    public raiseFeedBackTelemetry(feedbackEventObject: any) {
        if (this.isTelemetryInitialised()) {
            this.telemetryProvider.share(feedbackEventObject.edata, feedbackEventObject.options);
        }
    }
    public raiseFeedBackTelemetryWith(cdata: Array<ICDataEntry>, env: string, edata: any, telemetryObject?: ITelemetryObject) {

    }
}
