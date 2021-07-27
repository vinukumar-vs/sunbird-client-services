import { injectable } from 'inversify';
import { CsErrorEventData } from '../interfaces';
import { CsAppEvents } from '../interfaces/cs-app-events';
import { BaseEventImpl } from './base-event-impl';

/**
 * Extends abstract class BaseEvent
 * We have to define the `eventname` which is abstract property
 * Override the emit(data) method, if we have custom logic to generate the data
 */
export class ErrorEventServiceImpl extends BaseEventImpl {
  eventName = CsAppEvents.ERROR;
  
  /**
   * Only when we want to customize/change the data, then overrife the abstract "emit(data)" method
   * Overriding the default "emit()"
   * @param data 
   */
  emit(data:any){
    // generating telemetry edata based on the error response
    try {
    const params = data.error.response.body.params;
    if (params) {
      params.errmsg = params.errmsg.length > 50 ? (params.errmsg.substring(0, 50) + '...') : params.errmsg;
    }
    const errRes = data.error;
    const telemetryErrorData: CsErrorEventData = {
    edata: {
      err: (params && params.err) || (errRes && errRes.code),
      errtype: JSON.stringify(errRes && errRes.response.responseCode) || JSON.stringify(errRes && errRes.code),
      traceid: (params && params.msgid) || JSON.stringify(Math.random()),
      stacktrace: (params && params.errmsg) || (errRes && errRes.response.errorMesg)
      }
    }
    super.emit(telemetryErrorData);
  } catch(e) {console.log(e)}
} 
}
