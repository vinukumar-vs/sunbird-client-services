import {Content} from '../../../models';

export interface CsContentFilterCriteria extends CsFilterCriteria<Content | any> {}

export interface CsFilterCriteria<T> {
    filterAttribute: keyof T;
    filterCondition: CsFilterCondition;
}

export interface CsFilterCondition {
    operation: '==' | '<=' | '>=' | '!=';
    value: any;
}
