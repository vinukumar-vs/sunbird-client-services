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

    getDataAggregation(
      groupId: string,
      activity: Pick<GroupActivity, 'id' | 'type'>,
      mergeGroup?: Group,
      leafNodesCount?: number,
      config?: CsGroupServiceConfig
    ): Observable<CsGroupActivityDataAggregation> {
        const now = Date.now();
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
                                    lastUpdatedOn: now,
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

                if (!leafNodesCount) {
                    const groupActivity = (mergeGroup.activities || []).find((a) => {
                        return a.id === activity.id &&
                          a.type.toLowerCase() === activity.type.toLowerCase() &&
                          a.activityInfo &&
                          a.activityInfo.leafNodesCount;
                    });

                    if (groupActivity) {
                        response.activity.agg.push({
                            metric: CsGroupActivityAggregationMetric.LEAF_NODES_COUNT,
                            lastUpdatedOn: groupActivity.activityInfo.lastUpdatedOn ? (new Date(groupActivity.activityInfo.lastUpdatedOn)).getTime() : now,
                            value: groupActivity.activityInfo.leafNodesCount
                        });

                        leafNodesCount = groupActivity.activityInfo.leafNodesCount;
                    }
                } else {
                    response.activity.agg.push({
                        metric: CsGroupActivityAggregationMetric.LEAF_NODES_COUNT,
                        lastUpdatedOn: now,
                        value: leafNodesCount
                    });
                }

                response.members = (mergeGroup.members || [])
                    .map((member) => {
                        const maxCompletedCountMember = response.members
                        .filter((rm) => rm.userId === member.userId)
                        .sort((a, b) => {
                            const aCompletedCount = a.agg.find((agg) => agg.metric === CsGroupActivityAggregationMetric.COMPLETED_COUNT);
                            const bCompletedCount = b.agg.find((agg) => agg.metric === CsGroupActivityAggregationMetric.COMPLETED_COUNT);

                            if (!aCompletedCount && !bCompletedCount) {
                                return 0;
                            }

                            if (!aCompletedCount && bCompletedCount) {
                                return 1;
                            } else if (aCompletedCount && !bCompletedCount) {
                                return -1;
                            }

                            return bCompletedCount!.value - aCompletedCount!.value;
                        })[0];

                        if (maxCompletedCountMember) {
                            if (leafNodesCount) {
                                const completedCountMetric = maxCompletedCountMember.agg.find((agg) => agg.metric === CsGroupActivityAggregationMetric.COMPLETED_COUNT);

                                if (completedCountMetric) {
                                    maxCompletedCountMember.agg.push({
                                        metric: CsGroupActivityAggregationMetric.PROGRESS as any,
                                        lastUpdatedOn: now,
                                        value: Math.round((Math.min(completedCountMetric.value, leafNodesCount) / leafNodesCount) * 100)
                                    });
                                }
                            }

                            return maxCompletedCountMember;
                        }

                        return {
                            role: member.role,
                            createdBy: member.createdBy!,
                            name: member.name,
                            userId: member.userId,
                            status: member.status,
                            agg: [{
                                metric: CsGroupActivityAggregationMetric.COMPLETED_COUNT as any,
                                lastUpdatedOn: now,
                                value: 0
                            }]
                        };
                    });

                return response;
            })
        );
    }
}
