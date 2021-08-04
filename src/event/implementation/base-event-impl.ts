import { CsEvent } from '../interfaces/cs-event';
import { CsEventServiceImpl } from './event-service-impl';

export abstract class BaseEventImpl implements CsEvent{
    // All extending classes should define this property "eventName"
    public abstract eventName = 'default';
    data = {};

    constructor() { }
    
    /**
     * Default/Common logic for all extending classes. 
     * This method has to override by extending classes for any data maniputation
     * @param data 
     */
    emit(data: any) {
        this.data = data
        CsEventServiceImpl.events(this.eventName).next(this);
    }
}
