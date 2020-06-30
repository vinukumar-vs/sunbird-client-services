export enum GroupJoinStrategy {
    INVITE_ONLY = 'invite_only',
    MODERATED = 'moderated'
}

export enum GroupEntityStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

export enum GroupMemberRole {
    ADMIN = 'admin',
    MEMBER = 'member'
}

export interface GroupMember {
    memberId: string;
    name: string;
    role: GroupMemberRole;
    status: GroupEntityStatus;
    addedBy: string;
    addedOn: string;
    removedBy?: string;
    removedOn?: string;
    updatedBy?: string;
    updatedOn?: string;
}

// tslint:disable-next-line:no-empty-interface
export interface GroupActivity {
}

export interface Group {
    name: string;
    description: string;
    id: string;
    status: GroupEntityStatus;
    joinStrategy: GroupJoinStrategy;
    createdOn: string;
    createdBy: string;
    updatedOn: string;
    updatedBy: string;
    activities: GroupActivity[];
    members?: GroupMember[];
}
