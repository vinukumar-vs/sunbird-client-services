import {Group, GroupEntityStatus, GroupMemberRole, GroupMembershipType} from '../../../models/group';
import {Observable} from 'rxjs';
import {CsGroupServiceConfig} from '../../../index';

export interface CsGroupCreateRequest {
    name: string;
    membershipType?: GroupMembershipType;
    description: string;
}

export interface CsGroupCreateResponse {
    groupId: string;
}

export interface CsGroupUpdateRequest {
    name?: string;
    membershipType?: GroupMembershipType;
    description?: string;
    status?: GroupEntityStatus;
}

// tslint:disable-next-line:no-empty-interface
export interface CsGroupUpdateResponse {
}

export interface CsGroupAddMembersRequest {
    members: {
        userId: string;
        role: GroupMemberRole;
    }[];
}

export interface CsGroupAddMembersResponse {
    errors: any[];
}

export interface CsGroupRemoveMembersRequest {
    userIds: string[];
}

export interface CsGroupRemoveMembersResponse {
    errors: any[];
}

export interface CsGroupUpdateMembersRequest {
    members: {
        userId: string;
        role?: GroupMemberRole;
        status?: GroupEntityStatus;
    }[];
}

export interface CsGroupUpdateMembersResponse {
    errors: any[];
}

export interface CsGroupAddActivitiesRequest {
    activities: {
        id: string;
        type: string;
    }[];
}

export interface CsGroupAddActivitiesResponse {
    errors: any[];
}

export interface CsGroupUpdateActivitiesRequest {
    activities: {
        id: string;
        type?: string;
        status?: GroupEntityStatus;
    }[];
}

export interface CsGroupUpdateActivitiesResponse {
    errors: any[];
}

export interface CsGroupSearchCriteria {
    filters: {
        userId: string;
        groupAttribute?: { [key: string]: any | any[] }[]
    };
    sort_by?: { [key: string]: 'asc' | 'desc' };
    limit?: number;
    offset?: number;
}

export interface CsGroupDeleteResponse {
    errors: any[];
}

export interface CsGroupRemoveActivitiesRequest {
    activityIds: string[];
}

export interface CsGroupRemoveActivitiesResponse {
    errors: any[];
}

export interface CsGroupService {
    create(createRequest: CsGroupCreateRequest, config?: CsGroupServiceConfig): Observable<CsGroupCreateResponse>;

    getById(id: string, options?: { includeMembers?: boolean, includeActivities?: boolean }, config?: CsGroupServiceConfig): Observable<Group>;

    search(searchCriteria: CsGroupSearchCriteria, config?: CsGroupServiceConfig): Observable<Group[]>;

    updateById(id: string, updateRequest: CsGroupUpdateRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateResponse>;

    deleteById(id: string, config?: CsGroupServiceConfig): Observable<CsGroupDeleteResponse>;

    addMembers(groupId: string, addMembersRequest: CsGroupAddMembersRequest, config?: CsGroupServiceConfig): Observable<CsGroupAddMembersResponse>;

    updateMembers(groupId: string, updateMembersRequest: CsGroupUpdateMembersRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateMembersResponse>;

    removeMembers(groupId: string, removeMembersRequest: CsGroupRemoveMembersRequest, config?: CsGroupServiceConfig): Observable<CsGroupRemoveMembersResponse>;

    addActivities(groupId: string, addActivitiesRequest: CsGroupAddActivitiesRequest, config?: CsGroupServiceConfig): Observable<CsGroupAddActivitiesResponse>;

    updateActivities(groupId: string, updateActivitiesRequest: CsGroupUpdateActivitiesRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateActivitiesResponse>;

    removeActivities(groupId: string, removeActivitiesRequest: CsGroupRemoveActivitiesRequest, config?: CsGroupServiceConfig): Observable<CsGroupRemoveActivitiesResponse>;
}
