import { CsGroupSuspendResponse, CsGroupReactivateResponse, CsGroupUpdateGroupGuidelinesResponse, CsGroupUpdateGroupGuidelinesRequest } from './../interface/cs-group-service';
import { CsGroup } from './../../../models/group/index';
import {Container, inject, injectable, optional} from 'inversify';
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
    CsGroupSearchResponse,
    CsGroupService,
    CsGroupSupportedActivitiesFormField,
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
import {map, mergeMap} from 'rxjs/operators';
import {CsGroupActivityService} from '../activity/interface';
import {CsFormService} from '../../form/interface/cs-form-service';
import {Form} from '../../../models/form';

@injectable()
export class GroupServiceImpl implements CsGroupService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.group.GROUP_SERVICE_API_PATH) private apiPath: string,
        @inject(InjectionTokens.CONTAINER) private container: Container,
        @inject(InjectionTokens.services.form.FORM_SERVICE) private formService: CsFormService,
        @optional() @inject(InjectionTokens.services.group.GROUP_SERVICE_UPDATE_GUIDELINES_API_PATH) private updateGroupGuidelinesApiPath: string,
    ) {
    }

    private _activityService?: CsGroupActivityService;

    get activityService(): CsGroupActivityService {
        if (!this._activityService) {
            this._activityService = this.container.get<CsGroupActivityService>(InjectionTokens.services.group.GROUP_ACTIVITY_SERVICE);
        }

        return this._activityService;
    }

    create(createRequest: CsGroupCreateRequest, config?: CsGroupServiceConfig): Observable<CsGroupCreateResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/create`)
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
            .withPath(`${config ? config.apiPath : this.apiPath}/update`)
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
            .withPath(`${config ? config.apiPath : this.apiPath}/update`)
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
            .withPath(`${config ? config.apiPath : this.apiPath}/update`)
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
            .withPath(`${config ? config.apiPath : this.apiPath}/update`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    members: {
                        edit: updateMembersRequest.members
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
            .withPath(`${config ? config.apiPath : this.apiPath}/update`)
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
            .withPath(`${config ? config.apiPath : this.apiPath}/update`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    activities: {
                        edit: updateActivitiesRequest.activities
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
            .withPath(`${config ? config.apiPath : this.apiPath}/update`)
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
        id: string,
        options?: { includeMembers?: boolean, includeActivities?: boolean, groupActivities?: boolean },
        config?: CsGroupServiceConfig
    ): Observable<CsGroup> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/read/${id}`)
            .withParameters(options ? {
                fields: (() => {
                    const fields: string[] = [];
                    if (options.includeMembers) {
                        fields.push('members');
                    }
                    if (options.includeActivities) {
                        fields.push('activities');
                    }
                    return fields.join(',');
                })()
            } : {})
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: Group }>(apiRequest).pipe(
            map((r) => r.body.result),
            mergeMap(async (result) => {
                if (!options || !options.groupActivities || !options.includeActivities) {
                    return CsGroup.fromJSON(result);
                }

                const supportedActivitiesConfig = await this.getSupportedActivities().toPromise();

                const fields = supportedActivitiesConfig.data.fields.sort((f, g) => f.index - g.index);

                const activities = result.activities;
                delete result.activities;

                result.activitiesGrouped = fields.map((field) => {
                    const activitiesByActivityType = activities!.filter((activity) => activity.type === field.activityType)
                        .sort((a, b) => {
                            let comparison = 0;

                            for (const sortBy of field.sortBy) {
                                if (comparison !== 0) {
                                    break;
                                }

                                for (const key in sortBy) {
                                    if (!(key in sortBy)) {
                                        continue;
                                    }

                                    comparison = String(a.activityInfo[key]).localeCompare(String(b.activityInfo[key]));
                                    comparison = sortBy[key] === 'asc' ? comparison : -comparison;
                                }
                            }

                            return comparison;
                        });

                    return {
                        title: field.title,
                        translations: field.translations,
                        count: activitiesByActivityType.length,
                        isEnabled: field.isEnabled,
                        objectType: field.objectType,
                        items: activitiesByActivityType
                    };
                });

                return CsGroup.fromJSON(result);
            })
        );
    }

    search(searchCriteria: CsGroupSearchCriteria, config?: CsGroupServiceConfig): Observable<CsGroupSearchResponse[]> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/list`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: searchCriteria
            })
            .build();
        return this.httpService.fetch<{ result: { count: number; group: CsGroupSearchResponse[] } }>(apiRequest).pipe(
            map((r) =>
                r.body.result.group.sort((a, b) => {
                    const bLastActivity = b.updatedOn || b.createdOn!;
                    const aLastActivity = a.updatedOn || a.createdOn!;

                    if (a.status === GroupEntityStatus.SUSPENDED && b.status !== GroupEntityStatus.SUSPENDED) {
                        return 1;
                    } else if (b.status === GroupEntityStatus.SUSPENDED && a.status !== GroupEntityStatus.SUSPENDED) {
                        return -1;
                    }

                    return new Date(bLastActivity).getTime() - new Date(aLastActivity).getTime();
                })
                .map((g) => CsGroup.fromJSON(g) as CsGroupSearchResponse)
            )
        );
    }

    deleteById(id: string, config?: CsGroupServiceConfig): Observable<CsGroupDeleteResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.POST)
        .withPath(`${config ? config.apiPath : this.apiPath}/delete`)
        .withBearerToken(true)
        .withUserToken(true)
        .withBody({
            request: {
                groupId: id,
            }
        })
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }

    suspendById(id: string, config?: CsGroupServiceConfig): Observable<CsGroupSuspendResponse> {
        return this.updateById(id, {status: GroupEntityStatus.SUSPENDED}, config);
    }

    reactivateById(id: string, config?: CsGroupServiceConfig): Observable<CsGroupReactivateResponse> {
        return this.updateById(id, {status: GroupEntityStatus.ACTIVE}, config);
    }

    getSupportedActivities(config?: CsGroupServiceConfig): Observable<Form<CsGroupSupportedActivitiesFormField>> {
        const request = {
            'type': 'group',
            'subType': 'supported_activities',
            'action': 'list'
        };

        return this.formService.getForm<CsGroupSupportedActivitiesFormField>(request)
            .pipe(
                // TODO: remove objectType: content filter
                map((result) => {
                    result.data.fields = result.data.fields
                        .filter((field) => field.objectType.toLowerCase() === 'content');
                    return result;
                })
            );
    }
    updateGroupGuidelines(
        request: CsGroupUpdateGroupGuidelinesRequest, config?: CsGroupServiceConfig
    ): Observable<CsGroupUpdateGroupGuidelinesResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.PATCH)
            .withPath(`${config ? config.apiPath : this.updateGroupGuidelinesApiPath}/update`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    ...request
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupUpdateGroupGuidelinesResponse }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }
}
