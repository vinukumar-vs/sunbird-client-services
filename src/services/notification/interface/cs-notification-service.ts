import { Observable } from "rxjs";
import { CsNotificationServiceConfig } from "src";
import { NotificationData } from "src/models/notification";

export interface CsNotificationService {
  notificationRead( uid: string, config?: CsNotificationServiceConfig): Observable<CsNotificationReadResponse>;
  notificationUpdate( req: CsNotificationUpdateReq, config?: CsNotificationServiceConfig): Observable<any>;
  notificationDelete( req: CsNotificationDeleteReq, config?: CsNotificationServiceConfig): Observable<any>;
}

export interface CsNotificationReadResponse {
    result: { userFeed: Array<NotificationData> }
}
export interface CsNotificationUpdateReq {
}
export interface CsNotificationDeleteReq {
}

export interface CsNotificationUpdateResponse {
    result: any
}
