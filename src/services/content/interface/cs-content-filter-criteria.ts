export interface CsContentFilterCriteria {
    filterAttribute: string;
    filterCondition: CsFilterCondition;
}

export interface CsFilterCondition {
    operation: '==' | '<=' | '>=' | '!=';
    value: any;
}
