import { injectable } from 'inversify';
import { CsAppEvents } from '../interfaces/cs-app-events';
import { ErrorEventServiceImpl } from '../implementation/error-event-service-impl';

@injectable()

export class EventFactoryService {
  
  constructor() {  }

  /**
   * Library/Application will call this method to generate specific event based on condition where they want to generate the event.service
   * 
   * @param eventName 
   * @param data 
   */
  trigger(eventName, data) {
    switch(eventName) {
      case CsAppEvents.ERROR :
        // Generate specific event instance based on EventName
        let errorEventSerObj = new ErrorEventServiceImpl();
        errorEventSerObj.emit(data);
        break;
      default :  
        console.log(`There is no implementation for the event: ${eventName}`);
        break;;
    }
  }
}
