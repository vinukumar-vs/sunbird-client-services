import { Subject } from 'rxjs';
import { AppEvents } from '../interfaces/cs-app-events';
import { BaseEventImpl } from './base-event-impl';
import { ErrorEventServiceImpl } from './error-event-service-impl';

export class CsEventServiceImpl {
  // default event subject
  private static defatltEvent: Subject<BaseEventImpl> = new Subject<BaseEventImpl>();

  // Error event subject
  public static errorEvent: Subject<ErrorEventServiceImpl> =  new Subject<ErrorEventServiceImpl>();

  // Define other event subjects here & implement in events(method) switch case
  public init() {}
  /**
   * Application will subscribe to this method by passing eventName which there are interested
   * ex: EventService.events(AppEvents.ERROR).subscribe(err => ...)
   * 
   * @param eventName 
   * @returns Subject<any>
   */
  public static events(eventName: String): Subject<any> {
    let obsEvent;
    switch(eventName) {
      case AppEvents.ERROR: 
        obsEvent = this.errorEvent; 
        break;
      default: 
        console.log(`There is no implementation for the event: ${eventName}`);
        break;
    }
    return obsEvent;
  }

  constructor() { }
}
