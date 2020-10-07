export enum GroupMembershipType {
    INVITE_ONLY = 'invite_only',
    MODERATED = 'moderated'
}

export enum GroupEntityStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended'
}

export enum GroupMemberRole {
    ADMIN = 'admin',
    MEMBER = 'member'
}

export interface GroupMember {
    name: string;
    groupId: string;
    userId: string;
    role: GroupMemberRole;
    status: GroupEntityStatus;
    createdOn?: string;
    createdBy?: string;
    updatedOn?: string;
    updatedBy?: string;
}

export interface GroupActivity {
    id: string;
    type: string;
    status?: GroupEntityStatus;
    activityInfo?: any;
    createdOn?: string; // Record created date
    createdBy?: string; // Record created userid
    updatedOn?: string; // Record updated date
    updatedBy?: string; // Record updated userid
}

export interface ActivitiesGrouped {
    title: string;
    count: number;
    items: GroupActivity[];
}

export interface Group {
    name: string;
    description: string;
    id: string;
    status?: GroupEntityStatus;
    membershipType: GroupMembershipType;
    createdOn?: string;
    createdBy?: string;
    updatedOn?: string;
    updatedBy?: string;
    activities?: GroupActivity[];
    activitiesGrouped?: ActivitiesGrouped[];
    members?: GroupMember[];
}

export class CsGroup implements  Group {
    name: string;
    description: string;
    id: string;
    status?: GroupEntityStatus | undefined;
    membershipType: GroupMembershipType;
    createdOn?: string | undefined;
    createdBy?: string | undefined;
    updatedOn?: string | undefined;
    updatedBy?: string | undefined;
    activities?: GroupActivity[] | undefined;
    activitiesGrouped?: ActivitiesGrouped[] | undefined;
    members?: GroupMember[] | undefined;

    constructor(group) {
        // tslint:disable-next-line: forin
        for (const prop in group) {
            this[prop] = group[prop];
        }
    }

    isGroupActive(): boolean {
       return (this.status === GroupEntityStatus.ACTIVE);
    }
}
