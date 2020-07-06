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
import {Observable} from 'rxjs';
import {Group, GroupEntityStatus} from '../../../models/group';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map} from 'rxjs/operators';

@injectable()
export class GroupServiceImpl implements CsGroupService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.group.GROUP_SERVICE_API_PATH) private apiPath: string
    ) {
    }

    create(createRequest: CsGroupCreateRequest, config?: CsGroupServiceConfig): Observable<CsGroupCreateResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(this.apiPath + '/create')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: createRequest
            })
            .build();

        return this.httpService.fetch<{ result: { groupId: string; } }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    updateById(id: string, updateRequest: CsGroupUpdateRequest, config?: CsGroupServiceConfig): Observable<CsGroupUpdateResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(this.apiPath + '/update')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId: id,
                    ...updateRequest
                }
            })
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    addMembers(
        groupId: string, addMembersRequest: CsGroupAddMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupAddMembersResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(this.apiPath + '/update')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    members: {
                        add: addMembersRequest.members
                    }
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupAddMembersResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    removeMembers(
        groupId: string, removeMembersRequest: CsGroupRemoveMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupRemoveMembersResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(this.apiPath + '/update')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    members: {
                        remove: removeMembersRequest.userIds
                    }
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupRemoveMembersResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    updateMembers(
        groupId: string, updateMembersRequest: CsGroupUpdateMembersRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupUpdateMembersResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(this.apiPath + '/update')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    members: {
                        remove: updateMembersRequest.members
                    }
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupUpdateMembersResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    addActivities(
        groupId: string, addActivitiesRequest: CsGroupAddActivitiesRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupAddActivitiesResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(this.apiPath + '/update')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    activities: {
                        add: addActivitiesRequest.activities
                    }
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupAddActivitiesResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    updateActivities(
        groupId: string, updateActivitiesRequest: CsGroupUpdateActivitiesRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupUpdateActivitiesResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(this.apiPath + '/update')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    activities: {
                        add: updateActivitiesRequest.activities
                    }
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupUpdateActivitiesResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    removeActivities(
        groupId: string, removeActivitiesRequest: CsGroupRemoveActivitiesRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupRemoveActivitiesResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(this.apiPath + '/update')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    activities: {
                        remove: removeActivitiesRequest.activityIds
                    }
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupRemoveActivitiesResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    getById(
        id: string, options?: { includeMembers?: boolean, includeActivities?: boolean }, config?: CsGroupServiceConfig
    ): Observable<Group> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${this.apiPath}/read/${id}`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: Group }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    search(searchCriteria: CsGroupSearchCriteria, config?: CsGroupServiceConfig): Observable<Group[]> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${this.apiPath}/list`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: searchCriteria
            })
            .build();

        return this.httpService.fetch<{ result: { count: number; group: Group[] } }>(apiRequest).pipe(
            map((r) => r.body.result.group)
        );
    }

    deleteById(id: string, config?: CsGroupServiceConfig): Observable<CsGroupDeleteResponse> {
        return this.updateById(id, {status: GroupEntityStatus.INACTIVE}, config);
    }
}
