export interface CsEvent {
    eventName: string;
    data: any;
    emit(data:any);
}