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
    locationIds: string;
    framework: any;
    externalIds?: {
        id: string;
        operation: string;
        idType: string;
        provider: string;
    }[];
    declarations?: UserDeclaration[];
}

export enum UserDeclarationOperation {
    EDIT = 'edit',
    ADD = 'add',
    REMOVE = 'remove'
}

export enum UserDeclarationStatus {
    PENDING = 'PENDING',
    VALIDATED = 'VALIDATED',
    REJECTED = 'REJECTED',
    ERROR = 'ERROR'
}

export interface UserDeclaration {
    errorType?: string;
    status?: UserDeclarationStatus;
    operation: UserDeclarationOperation;
    userId: string;
    orgId: string;
    persona: string;
    info: {
        [key: string]: any
    };
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

export interface Consent {
    userId: string;
    objectId: string;
    objectType?: string;
    subjectId: string;
    subjectType: string;
    consented?: boolean;
    lastUpdatedOn?: string;
}
