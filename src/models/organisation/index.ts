export interface Organisation {
    channel: string;
    description?: string;
    id: string;
    provider: string;
    rootOrgId: string;
    createdDate: string;
    createdBy: string;
    hashTagId: string;
    parentOrgId?: string;
    status: number;
    slug: string;
    isRootOrg: boolean;
    orgCode?: string;
    externalId: string;
    orgName: string;
}
