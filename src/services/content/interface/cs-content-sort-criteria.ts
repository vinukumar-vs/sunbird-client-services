export interface CsContentSortCriteria {
    sortAttribute: string;
    sortOrder: CsSortOrder;
}

export enum CsSortOrder {
    ASC = 'asc',
    DESC = 'desc'
}
