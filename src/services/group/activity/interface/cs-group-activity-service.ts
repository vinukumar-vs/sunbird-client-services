import {Observable} from 'rxjs';
import {CsGroupServiceConfig} from '../../../../cs-module';
import {GroupActivity, GroupEntityStatus, GroupMemberRole} from '../../../../models/group';

export enum CsGroupActivityAggregationMetric {
    ENROLMENT_COUNT = 'enrolmentCount',
    COMPLETED_COUNT = 'completedCount'
}

export interface CsGroupActivityDataAggregation {
    groupId: string;
    activity: {
        id: string;
        type: string;
        agg: {
            metric: CsGroupActivityAggregationMetric.ENROLMENT_COUNT,
            lastUpdatedOn: number;
            value: number;
        }[],
    };
    members: [
        {
            role: GroupMemberRole;
            createdBy: string;
            name: string;
            userId: string;
            status: GroupEntityStatus
            agg: {
                metric: CsGroupActivityAggregationMetric.COMPLETED_COUNT,
                lastUpdatedOn: number;
                value: number;
            }[],
        }
    ];
}

export interface CsGroupActivityService {
    getDataAggregation(groupId: string, activity: Pick<GroupActivity, 'id' | 'type'>, config?: CsGroupServiceConfig): Observable<CsGroupActivityDataAggregation>;
}
