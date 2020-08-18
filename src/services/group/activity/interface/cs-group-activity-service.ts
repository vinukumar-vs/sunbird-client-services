import {Observable} from 'rxjs';
import {CsGroupServiceConfig} from '../../../../cs-module';
import {Group, GroupActivity, GroupEntityStatus, GroupMemberRole} from '../../../../models/group';

export enum CsGroupActivityAggregationMetric {
    ENROLMENT_COUNT = 'enrolmentCount',
    COMPLETED_COUNT = 'completedCount',
    LEAF_NODES_COUNT = 'leafNodesCount',
    PROGRESS = 'progress',
}

export interface CsGroupActivityDataAggregation {
    groupId: string;
    activity: {
        id: string;
        type: string;
        agg: {
            metric: CsGroupActivityAggregationMetric.ENROLMENT_COUNT | CsGroupActivityAggregationMetric.LEAF_NODES_COUNT,
            lastUpdatedOn: number;
            value: number;
        }[],
    };
    members: {
        role: GroupMemberRole;
        createdBy: string;
        name: string;
        userId: string;
        status: GroupEntityStatus;
        agg: {
            metric: CsGroupActivityAggregationMetric.COMPLETED_COUNT | CsGroupActivityAggregationMetric.PROGRESS,
            lastUpdatedOn: number;
            value: number;
        }[],
    }[];
}

export interface CsGroupActivityService {
    getDataAggregation(groupId: string, activity: Pick<GroupActivity, 'id' | 'type'>, mergeGroup?: Group, leafNodesCount?: number, config?: CsGroupServiceConfig): Observable<CsGroupActivityDataAggregation>;
}
