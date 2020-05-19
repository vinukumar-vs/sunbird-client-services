export interface User {
    id: string;
    userId: string;
    identifier: string;
    firstName: string;
    lastName?: string;
    rootOrg: RootOrg;
    tncAcceptedVersion: string;
    tncAcceptedOn: string;
    tncLatestVersion: string;
    promptTnC: boolean;
    tncLatestVersionUrl: string;
    avatar: string;
    managedBy: string;
}

export interface RootOrg {
    rootOrgId?: string;
    orgName?: string;
    slug?: string;
    hashTagId: string;
}

export interface Location {
    code: string;
    name: string;
    id: string;
    type: string;
}

export interface Feed {
    id: string;
    userId: string;
    category: string;
    priority: number;
    createdBy: string;
    createdOn: string;
    channel: string;
    status: string;
    expireOn: string;
    data: {
        prospectChannels: string[];
    };
}
