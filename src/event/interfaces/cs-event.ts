export interface CsEvent {
    eventName: string;
    data: any;
    emit(data:any);
}
export interface CsErrorEventData {
    edata: {
    'err': string;
    'errtype': string;
    'stacktrace': string;
    'traceid': string;
    }
  }