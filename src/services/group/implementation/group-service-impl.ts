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
import {Group, GroupActivity, GroupEntityStatus, GroupJoinStrategy, GroupMember} from '../../../models/group';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpClientError} from '../../../core/http-service/errors';
import {CsResponse} from '../../../core/http-service/interface';

@injectable()
export class GroupServiceImpl implements CsGroupService {
    private mockDB: Map<string, Group> = new Map<string, Group>();
    private userId = 'SAMPLE_CURRENT_USER_ID';

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


    constructor(@inject(InjectionTokens.core.api.authentication.USER_TOKEN) userToken) {
    }

    create(createRequest: CsGroupCreateRequest, config?: CsGroupServiceConfig): Observable<CsGroupCreateResponse> {
        const newGroupId = GroupServiceImpl.create_UUID();

        this.mockDB[newGroupId] = {
            name: createRequest.name,
            description: createRequest.description,
            id: newGroupId,
            status: GroupEntityStatus.ACTIVE,
            joinStrategy: createRequest.joinStrategy || GroupJoinStrategy.INVITE_ONLY,
            createdOn: new Date().toISOString(),
            createdBy: 'SAMPLE_CURRENT_USER_ID',
            updatedOn: new Date().toISOString(),
            updatedBy: new Date().toISOString(),
            activities: [],
            members: createRequest.members ? [
                ...createRequest.members.map<GroupMember>((m) => {
                    return {
                        memberId: m.memberId,
                        name: 'SOME_MEMBER_NAME',
                        role: m.role,
                        status: GroupEntityStatus.ACTIVE,
                        addedBy: this.userId,
                        addedOn: new Date().toISOString()
                    };
                })
            ] : []
        };

        return of({
            groupId: newGroupId
        });
    }

    updateById(id: string, updateRequest: CsGroupUpdateRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateResponse> {
        if (!this.mockDB[id]) {
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

        if (updateRequest.joinStrategy) {
            this.mockDB.get(id)!.joinStrategy = updateRequest.joinStrategy;
        }

        return of({});
    }

    addMembers(
        groupId: string, addMembersRequest: CsGroupAddMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupAddMembersResponse> {
        if (!this.mockDB[groupId]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.members = [
            ...(this.mockDB.get(groupId)!.members || []),
            ...addMembersRequest.members.map<GroupMember>((m) => {
                return {
                    memberId: m.memberId,
                    name: 'SOME_MEMBER_NAME',
                    role: m.role,
                    status: GroupEntityStatus.ACTIVE,
                    addedBy: this.userId,
                    addedOn: new Date().toISOString()
                };
            })
        ];

        return of({errors: []});
    }

    removeMembers(
        groupId: string, removeMembersRequest: CsGroupRemoveMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupRemoveMembersResponse> {
        if (!this.mockDB[groupId]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.members = [
            ...(this.mockDB.get(groupId)!.members || []).filter((m) => !removeMembersRequest.memberIds.find(m1 => m1 === m.memberId))
        ];

        return of({errors: []});
    }

    updateMembers(
        groupId: string, updateMembersRequest: CsGroupUpdateMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupUpdateMembersResponse> {
        if (!this.mockDB[groupId]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.members = [
            ...(this.mockDB.get(groupId)!.members || []).map((m) => {
                const toUpdate = updateMembersRequest.members.find(m1 => m1.memberId === m.memberId);

                if (toUpdate) {
                    return {
                        ...m,
                        role: toUpdate.role
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
        if (!this.mockDB[groupId]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.activities = [
            ...(this.mockDB.get(groupId)!.activities || []),
            ...addActivitiesRequest.activities.map<GroupActivity>((m) => {
                return m;
            })
        ];

        return of({errors: []});
    }

    updateActivities(
        groupId: string, updateActivitiesRequest: CsGroupUpdateActivitiesRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupUpdateActivitiesResponse> {
        if (!this.mockDB[groupId]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.activities = [
            ...(this.mockDB.get(groupId)!.activities || []).map((a) => {
                const toUpdate = updateActivitiesRequest.activities.find(a1 => a['id'] === a1['id']);

                if (toUpdate) {
                    return {
                        ...a,
                        ...toUpdate
                    };
                }

                return a;
            })
        ];

        return of({errors: []});
    }

    getById(id: string, includeMembers?: boolean, config?: CsGroupServiceConfig): Observable<Group> {
        if (!this.mockDB[id]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        return of({
            ...this.mockDB.get(id)!,
            members: includeMembers ? this.mockDB.get(id)!.members : undefined
        });
    }

    getMembers(groupId: string, config?: CsGroupServiceConfig): Observable<GroupMember[]> {
        if (!this.mockDB[groupId]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        return of(this.mockDB.get(groupId)!.members || []);
    }

    search(searchCriteria: CsGroupSearchCriteria, config?: CsGroupServiceConfig): Observable<Group[]> {
        return of(
            Array.from(this.mockDB.values()).filter((g) =>
                (g.members || []).find((m) => m.memberId === searchCriteria.filters.memberId)
            )
        );
    }

    deleteById(id: string, config?: CsGroupServiceConfig): Observable<CsGroupDeleteResponse> {
        if (!this.mockDB[id]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        return of({errors: []});
    }

    removeActivities(groupId: string, removeActivitiesRequest: CsGroupRemoveActivitiesRequest, config?: CsGroupServiceConfig): Observable<CsGroupRemoveActivitiesResponse> {
        if (!this.mockDB[groupId]) {
            return throwError(new CsHttpClientError('group with id not found', new CsResponse<any>()));
        }

        this.mockDB.get(groupId)!.activities = [
            ...(this.mockDB.get(groupId)!.activities || []).filter((a) => !removeActivitiesRequest.activityIds.find(a1 => a1['id'] === a['id']))
        ];

        return of({errors: []});
    }
}
