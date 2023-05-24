import { Observable } from "rxjs";
import { CsNotificationServiceConfig } from "../../../cs-module";
import { NotificationData } from "../../../models/notification";

export interface CsNotificationService {
  notificationRead( uid: string, config?: CsNotificationServiceConfig): Observable<CsNotificationReadResponse>;
  notificationUpdate( req: CsNotificationUpdateReq, config?: CsNotificationServiceConfig): Observable<any>;
  notificationDelete( req: CsNotificationDeleteReq, config?: CsNotificationServiceConfig): Observable<any>;
}

export interface CsNotificationReadResponse {
    feeds: Array<NotificationData>
}
export interface CsNotificationUpdateReq {
  ids: string[],
  userId: string
}
export interface CsNotificationDeleteReq {
  ids: string[],
  userId: string
}

export interface CsNotificationUpdateResponse {
    result: any
}
