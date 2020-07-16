import {CsGroupActivityAggregationMetric, CsGroupActivityDataAggregation, CsGroupActivityService} from '../interface';
import {Observable, of, throwError} from 'rxjs';
import {CsHttpRequestType, CsHttpResponseCode, CsHttpService, CsRequest} from '../../../../core/http-service/interface';
import {catchError, map} from 'rxjs/operators';
import {CsGroupServiceConfig} from '../../../../cs-module';
import {inject, injectable} from 'inversify';
import {InjectionTokens} from '../../../../injection-tokens';
import {Group, GroupActivity} from '../../../../models/group';
import {CsHttpClientError} from '../../../../core/http-service/errors';

@injectable()
export class GroupActivityServiceImpl implements CsGroupActivityService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.group.GROUP_SERVICE_DATA_API_PATH) private dataApiPath: string
    ) {
    }

    getDataAggregation(groupId: string, activity: Pick<GroupActivity, 'id' | 'type'>, mergeGroup?: Group, config?: CsGroupServiceConfig): Observable<CsGroupActivityDataAggregation> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.dataApiPath : this.dataApiPath}/activity/agg`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    groupId,
                    activityId: activity.id,
                    activityType: activity.type
                }
            })
            .build();

        return this.httpService.fetch<{ result: CsGroupActivityDataAggregation }>(apiRequest).pipe(
            map((r) => r.body.result),
            catchError((e) => {
                if (
                    CsHttpClientError.isInstance(e) &&
                    (e as CsHttpClientError).response.responseCode === CsHttpResponseCode.HTTP_BAD_REQUEST &&
                    // TODO: to add error code
                    (e as CsHttpClientError).response.body.params.errmsg.includes('No member found in this group')
                ) {
                    return of({
                        activity: {
                            agg: [
                                {
                                    metric: CsGroupActivityAggregationMetric.ENROLMENT_COUNT as any,
                                    lastUpdatedOn: Date.now(),
                                    value: 0
                                }
                            ],
                            id: activity.id,
                            type: activity.type
                        },
                        groupId,
                        members: []
                    } as CsGroupActivityDataAggregation);
                }

                return throwError(e);
            }),
            map((response) => {
                if (!mergeGroup) {
                    return response;
                }

                const groupActivity = (mergeGroup.activities || []).find((a) => {
                    return a.id === activity.id &&
                        a.type.toLowerCase() === activity.type.toLowerCase() &&
                        a.activityInfo &&
                        a.activityInfo.leafNodesCount;
                });

                if (groupActivity) {
                    response.activity.agg.push({
                        metric: CsGroupActivityAggregationMetric.LEAF_NODES_COUNT,
                        lastUpdatedOn: groupActivity.activityInfo.lastUpdatedOn ? (new Date(groupActivity.activityInfo.lastUpdatedOn)).getTime() : Date.now(),
                        value: groupActivity.activityInfo.leafNodesCount
                    });
                }

                response.members = (mergeGroup.members || []).map((member) => {
                    const responseMember = response.members.find((rm) => rm.userId === member.userId);

                    if (responseMember) {
                        return responseMember;
                    }

                    return {
                        role: member.role,
                        createdBy: member.createdBy!,
                        name: member.name,
                        userId: member.userId,
                        status: member.status,
                        agg: [{
                            metric: CsGroupActivityAggregationMetric.COMPLETED_COUNT as any,
                            lastUpdatedOn: Date.now(),
                            value: 0
                        }]
                    };
                });

                return response;
            })
        );
    }
}
