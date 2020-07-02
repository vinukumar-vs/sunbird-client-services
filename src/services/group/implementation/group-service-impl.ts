import {inject, injectable} from 'inversify';
import {
    CsGroupAddActivitiesRequest,
    CsGroupAddActivitiesResponse,
    CsGroupAddMembersRequest,
    CsGroupAddMembersResponse,
    CsGroupCreateRequest,
    CsGroupCreateResponse,
    CsGroupDeleteResponse,
    CsGroupRemoveActivitiesRequest,
    CsGroupRemoveActivitiesResponse,
    CsGroupRemoveMembersRequest,
    CsGroupRemoveMembersResponse,
    CsGroupSearchCriteria,
    CsGroupService,
    CsGroupUpdateActivitiesRequest,
    CsGroupUpdateActivitiesResponse,
    CsGroupUpdateMembersRequest,
    CsGroupUpdateMembersResponse,
    CsGroupUpdateRequest,
    CsGroupUpdateResponse
} from '../interface';
import {CsGroupServiceConfig} from '../../..';
import {Observable, of, throwError} from 'rxjs';
import {Group, GroupActivity, GroupEntityStatus, GroupMember, GroupMemberRole, GroupMembershipType} from '../../../models/group';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpClientError} from '../../../core/http-service/errors';
import {CsResponse} from '../../../core/http-service/interface';
import jwtDecode from 'jwt-decode';

@injectable()
export class GroupServiceImpl implements CsGroupService {
    private mockDB: Map<string, Group> = new Map<string, Group>();
    private userId: string;

    static create_UUID() {
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line:no-bitwise
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            // tslint:disable-next-line:no-bitwise
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }


    constructor(
        @inject(InjectionTokens.core.api.authentication.USER_TOKEN) userToken,
    ) {
        try {
            const payload = jwtDecode(userToken);
            this.userId = payload.sub.split(':').length === 3 ? <string> payload.sub.split(':').pop() : payload.sub;
        } catch (e) {
            this.userId = 'cb92b212-feae-4931-bb48-db4822b61fe4';
        }
    }

    create(createRequest: CsGroupCreateRequest, config?: CsGroupServiceConfig): Observable<CsGroupCreateResponse> {
        const newGroupId = GroupServiceImpl.create_UUID();

        this.mockDB.set(newGroupId, {
            name: createRequest.name,
            description: createRequest.description,
            id: newGroupId,
            status: GroupEntityStatus.ACTIVE,
            membershipType: createRequest.membershipType || GroupMembershipType.INVITE_ONLY,
            createdOn: new Date().toISOString(),
            createdBy: this.userId,
            activities: [],
            members: [
                {
                    groupId: newGroupId,
                    userId: this.userId,
                    name: 'SOME_MEMBER_NAME',
                    role: GroupMemberRole.ADMIN,
                    status: GroupEntityStatus.ACTIVE,
                    createdBy: this.userId,
                    createdOn: new Date().toISOString()
                }
            ]
        });

        return of({
            groupId: newGroupId
        });
    }

    updateById(id: string, updateRequest: CsGroupUpdateRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateResponse> {
        if (!this.mockDB.get(id)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        if (updateRequest.name) {
            this.mockDB.get(id)!.name = updateRequest.name;
        }

        if (updateRequest.description) {
            this.mockDB.get(id)!.description = updateRequest.description;
        }

        if (updateRequest.status) {
            this.mockDB.get(id)!.status = updateRequest.status;
        }

        if (updateRequest.membershipType) {
            this.mockDB.get(id)!.membershipType = updateRequest.membershipType;
        }

        return of({});
    }

    addMembers(
        groupId: string, addMembersRequest: CsGroupAddMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupAddMembersResponse> {
        if (!this.mockDB.get(groupId)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.members = [
            ...(this.mockDB.get(groupId)!.members || []),
            ...addMembersRequest.members.map<GroupMember>((m) => {
                return {
                    groupId: groupId,
                    userId: m.userId,
                    name: 'SOME_MEMBER_NAME',
                    role: m.role,
                    status: GroupEntityStatus.ACTIVE,
                    createdBy: this.userId,
                    createdOn: new Date().toISOString()
                };
            })
        ];

        return of({errors: []});
    }

    removeMembers(
        groupId: string, removeMembersRequest: CsGroupRemoveMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupRemoveMembersResponse> {
        if (!this.mockDB.get(groupId)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.members = [
            ...(this.mockDB.get(groupId)!.members || []).filter((m) => !removeMembersRequest.userIds.find(m1 => m1 === m.userId))
        ];

        return of({errors: []});
    }

    updateMembers(
        groupId: string, updateMembersRequest: CsGroupUpdateMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupUpdateMembersResponse> {
        if (!this.mockDB.get(groupId)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.members = [
            ...(this.mockDB.get(groupId)!.members || []).map((m) => {
                const toUpdate = updateMembersRequest.members.find(m1 => m1.userId === m.userId);

                if (toUpdate) {
                    return {
                        ...m,
                        role: toUpdate.role || m.role,
                        status: toUpdate.status || m.status
                    };
                }

                return m;
            })
        ];

        return of({errors: []});
    }

    addActivities(
        groupId: string, addActivitiesRequest: CsGroupAddActivitiesRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupAddActivitiesResponse> {
        if (!this.mockDB.get(groupId)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.activities = [
            ...(this.mockDB.get(groupId)!.activities || []),
            ...addActivitiesRequest.activities.map<GroupActivity>((m) => {
                return {
                    ...m,
                    status: GroupEntityStatus.ACTIVE
                };
            })
        ];

        return of({errors: []});
    }

    updateActivities(
        groupId: string, updateActivitiesRequest: CsGroupUpdateActivitiesRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupUpdateActivitiesResponse> {
        if (!this.mockDB.get(groupId)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.activities = [
            ...(this.mockDB.get(groupId)!.activities || []).map((a) => {
                const toUpdate = updateActivitiesRequest.activities.find(a1 => a.id === a1.id);

                if (toUpdate) {
                    return {
                        ...a,
                        type: toUpdate.type || a.type,
                        status: toUpdate.status || a.status
                    };
                }

                return a;
            })
        ];

        return of({errors: []});
    }

    getById(
        id: string, options?: { includeMembers?: boolean, includeActivities?: boolean }, config?: CsGroupServiceConfig
    ): Observable<Group> {
        if (!this.mockDB.get(id)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        return of({
            ...this.mockDB.get(id)!,
            members: (options && options.includeMembers) ? this.mockDB.get(id)!.members : undefined,
            activities: (options && options.includeActivities) ? this.mockDB.get(id)!.activities : undefined,
        });
    }

    search(searchCriteria: CsGroupSearchCriteria, config?: CsGroupServiceConfig): Observable<Group[]> {
        return of(
            Array.from(this.mockDB.values()).filter((g) =>
                (g.members || []).find((m) => m.userId === searchCriteria.filters.userId)
            )
        );
    }

    deleteById(id: string, config?: CsGroupServiceConfig): Observable<CsGroupDeleteResponse> {
        if (!this.mockDB.get(id)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.delete(id);

        return of({errors: []});
    }

    removeActivities(
        groupId: string, removeActivitiesRequest: CsGroupRemoveActivitiesRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupRemoveActivitiesResponse> {
        if (!this.mockDB.get(groupId)) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.activities = [
            ...(this.mockDB.get(groupId)!.activities || []).filter((a) => !removeActivitiesRequest.activityIds.find(a1 => a1['id'] === a['id']))
        ];

        return of({errors: []});
    }
}
