export enum GroupMembershipType {
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
    username: string;
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
    status: GroupEntityStatus;
    createdOn?: string; // Record created date
    createdBy?: string; // Record created userid
    updatedOn?: string; // Record updated date
    updatedBy?: string; // Record updated userid
}

export interface Group {
    name: string;
    description: string;
    id: string;
    status: GroupEntityStatus;
    membershipType: GroupMembershipType;
    createdOn?: string;
    createdBy?: string;
    updatedOn?: string;
    updatedBy?: string;
    activities?: GroupActivity[];
    members?: GroupMember[];
}
