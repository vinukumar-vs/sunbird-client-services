import {Group, GroupEntityStatus, GroupJoinStrategy, GroupMember, GroupMemberRole} from '../../../models/group';
import {Observable} from 'rxjs';
import {CsGroupServiceConfig} from '../../../index';

export interface CsGroupCreateRequest {
    name: string;
    joinStrategy?: GroupJoinStrategy;
    description: string;
    members: {
        memberId: string;
        role: GroupMemberRole
    }[];
}

export interface CsGroupCreateResponse {
    groupId: string;
}

export interface CsGroupUpdateRequest {
    name?: string;
    description?: string;
    status?: GroupEntityStatus;
    joinStrategy?: GroupJoinStrategy;
}

// tslint:disable-next-line:no-empty-interface
export interface CsGroupUpdateResponse {
}

export interface CsGroupAddMembersRequest {
    members: {
        memberId: string;
        role: GroupMemberRole;
    }[];
}

export interface CsGroupAddMembersResponse {
    errors: string[];
}

export interface CsGroupRemoveMembersRequest {
    memberIds: string[];
}

export interface CsGroupRemoveMembersResponse {
    errors: string[];
}

export interface CsGroupUpdateMembersRequest {
    members: {
        memberId: string;
        role: GroupMemberRole;
    }[];
}

export interface CsGroupUpdateMembersResponse {
    errors: string[];
}

export interface CsGroupAddActivitiesRequest {
    activities: {
        [key: string]: any
    }[];
}

export interface CsGroupAddActivitiesResponse {
    errors: string[];
}

export interface CsGroupUpdateActivitiesRequest {
    activities: {
        [key: string]: any
    }[];
}

export interface CsGroupUpdateActivitiesResponse {
    errors: string[];
}

export interface CsGroupSearchCriteria {
    filters: {
        memberId: string;
    };
    sort_by: Map<keyof Group, 'desc' | 'asc'>;
    limit: number;
    offset: number;
}

export interface CsGroupDeleteResponse {
    errors: string[];
}

export interface CsGroupRemoveActivitiesRequest {
    activityIds: string[];
}

export interface CsGroupRemoveActivitiesResponse {
    errors: string[];
}

export interface CsGroupService {
    create(createRequest: CsGroupCreateRequest, config?: CsGroupServiceConfig): Observable<CsGroupCreateResponse>;

    getById(id: string, includeMembers?: boolean, config?: CsGroupServiceConfig): Observable<Group>;

    search(searchCriteria: CsGroupSearchCriteria, config?: CsGroupServiceConfig): Observable<Group[]>;

    updateById(id: string, updateRequest: CsGroupUpdateRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateResponse>;

    deleteById(id: string, config?: CsGroupServiceConfig): Observable<CsGroupDeleteResponse>;

    getMembers(groupId: string, config?: CsGroupServiceConfig): Observable<GroupMember[]>;

    addMembers(groupId: string, addMembersRequest: CsGroupAddMembersRequest, config?: CsGroupServiceConfig): Observable<CsGroupAddMembersResponse>;

    updateMembers(groupId: string, updateMembersRequest: CsGroupUpdateMembersRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateMembersResponse>;

    removeMembers(groupId: string, removeMembersRequest: CsGroupRemoveMembersRequest, config?: CsGroupServiceConfig): Observable<CsGroupRemoveMembersResponse>;

    addActivities(groupId: string, addActivitiesRequest: CsGroupAddActivitiesRequest, config?: CsGroupServiceConfig): Observable<CsGroupAddActivitiesResponse>;

    updateActivities(groupId: string, updateActivitiesRequest: CsGroupUpdateActivitiesRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateActivitiesResponse>;

    removeActivities(groupId: string, removeActivitiesRequest: CsGroupRemoveActivitiesRequest, config?: CsGroupServiceConfig): Observable<CsGroupRemoveActivitiesResponse>;
}
