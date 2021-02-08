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
    translations?: string;
    count: number;
    isEnabled: boolean;
    objectType: string;
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

export class CsGroupActivity implements GroupActivity {
    id: string;
    type: string;
    status?: GroupEntityStatus;
    activityInfo?: any;
    createdOn?: string; // Record created date
    createdBy?: string; // Record created userid
    updatedOn?: string; // Record updated date
    updatedBy?: string; // Record updated userid

    static fromJSON(obj: {}): CsGroupActivity {
        return Object.setPrototypeOf(obj, new CsGroupActivity());
    }
}

export class CsGroupMember implements GroupMember {
    name: string;
    groupId: string;
    userId: string;
    role: GroupMemberRole;
    status: GroupEntityStatus;
    createdOn?: string;
    createdBy?: string;
    updatedOn?: string;
    updatedBy?: string;

    static fromJSON(obj: {}): CsGroupMember {
        return Object.setPrototypeOf(obj, new CsGroupMember());
    }
}

export class CsGroup implements Group {
    name: string;
    description: string;
    id: string;
    status?: GroupEntityStatus;
    membershipType: GroupMembershipType;
    createdOn?: string;
    createdBy?: string;
    updatedOn?: string;
    updatedBy?: string;
    activitiesGrouped?: ActivitiesGrouped[];
    members?: CsGroupMember[];
    activities?: CsGroupActivity[];
    active: boolean;

    static fromJSON(obj: {}): CsGroup {
        const instance: CsGroup = Object.setPrototypeOf(obj, new CsGroup());
        instance.active = instance.status === GroupEntityStatus.ACTIVE;

        if (instance.members) {
            instance.members = instance.members.map(m => CsGroupMember.fromJSON(m));
        }

        if (instance.activities) {
            instance.activities = instance.activities.map(a => CsGroupActivity.fromJSON(a));
        }

        return instance;
    }

    isActive(): boolean {
        this.active = (this.status === GroupEntityStatus.ACTIVE);
        return this.active;
    }
}
