import { injectable } from 'inversify';
import { CsErrorEventData } from '../interfaces';
import { CsAppEvents } from '../interfaces/cs-app-events';
import { BaseEventImpl } from './base-event-impl';
import * as _ from 'lodash-es';

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
    const params = data.error.response.body.params;
    if (params) {
      params.errmsg = params.errmsg.length > 50 ? (params.errmsg.substring(0, 50) + '...') : params.errmsg;
    }
    const errRes = data.error;
    const telemetryErrorData: CsErrorEventData = {
    edata: {
      err: _.get(params, 'err') || _.get(errRes, 'code'),
      errtype: JSON.stringify(_.get(errRes, 'response.responseCode')) || JSON.stringify(_.get(errRes, 'code')),
      traceid: _.get(params, 'msgid') || JSON.stringify(Math.random()),
      stacktrace: _.get(params, 'errmsg') || _.get(errRes, 'response.errorMesg')
      }
    }
    super.emit(telemetryErrorData);
  }
}
