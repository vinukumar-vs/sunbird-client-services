import { injectable } from 'inversify';
import { AppEvents } from '../interfaces/cs-app-events';
import { BaseEventImpl } from './base-event-impl';

@injectable()

/**
 * Extends abstract class BaseEvent
 * We have to define the `eventname` which is abstract property
 * Override the emit(data) method, if we have custom logic to generate the data
 */
export class ErrorEventServiceImpl extends BaseEventImpl {
  eventName = AppEvents.ERROR;
  
  /**
   * Only when we want to customize/change the data, then overrife the abstract "emit(data)" method
   * Overriding the default "emit()"
   * @param data 
   */
  emit(data:any){
    // Add custom logic to modidy the data 
    super.emit(data);
  }
}
