import {Content} from '../../../models';

type Primitive = string | number | boolean;

export interface CsContentSortCriteria extends CsSortCriteria<Content | any> {}

export interface CsSortCriteria<T> {
    sortAttribute: keyof T;
    sortOrder: CsSortOrder | CsSortComprehension;
}

export interface CsSortComprehension {
    order: CsSortOrder;
    preference?: Primitive[];
}

export enum CsSortOrder {
    ASC = 'asc',
    DESC = 'desc'
}
