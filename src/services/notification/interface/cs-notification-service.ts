import { Observable } from "rxjs";
import { CsNotificationServiceConfig } from "src";

export interface CsNotificationService {
  notificationRead( uid: number, config?: CsNotificationServiceConfig): Observable<CsNotificationReadResponse>;
}

export interface CsNotificationReadResponse {
    result: { feed: Array<any> }
}

export interface CsNotificationUpdateResponse {
    result: {}
}