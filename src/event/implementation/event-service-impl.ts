import { Subject } from 'rxjs';
import { AppEvents } from '../interfaces/cs-app-events';
import { BaseEvent } from './base-event-impl';
import { ErrorEventService } from './error-event-service-impl';

export class CsEventService {
  // default event subject
  private static defatltEvent: Subject<BaseEvent> = new Subject<BaseEvent>();

  // Error event subject
  public static errorEvent: Subject<ErrorEventService> =  new Subject<ErrorEventService>();

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
