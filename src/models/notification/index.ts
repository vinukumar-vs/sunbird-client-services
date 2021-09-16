export enum NotificationStatus {
    READ = 'read',
    UNREAD = 'unread'
}

export enum NotificationType {
    MEMBER_EXIT = 'member-exit',
    UNREAD = 'unread'
}

export enum NotificationCategory {
    GROUPS = 'groups',
}

export interface NotificationTemplate {
    data?: string,
    type?: string,
    ver?: any
}

export interface NotificationAction {
    type: NotificationType | any,
    category: NotificationCategory | any,
    template: NotificationTemplate,
    createdBy: any,
    additionalInfo: any,
    groupRole: string
}

export interface NotificationData {
    id: string,
    userId?: string,                    
    priority?: number,
    createdBy: string,
    status:NotificationStatus | any,
    createdOn: number,
    action: NotificationAction                                     
}
