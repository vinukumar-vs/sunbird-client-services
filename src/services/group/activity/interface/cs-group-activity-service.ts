import {Observable} from 'rxjs';
import {CsGroupServiceConfig} from '../../../../cs-module';
import {GroupActivity} from '../../../../models/group';

export enum CsGroupActivityAggregationMetric {
    ENROLMENT_COUNT = 'enrolmentCount',
    COMPLETED_COUNT = 'completedCount'
}

export interface CsGroupActivityDataAggregation {
    groupId: string;
    activity: {
        id: string; // activity ID
        type: string;
        agg: {
            metric: CsGroupActivityAggregationMetric.ENROLMENT_COUNT,
            lastUpdatedOn: number;
            value: number;
        }[],
    };
    members: [
        {
            id: string; // user ID
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
