import {Content} from '../content';

export interface Batch {
    identifier: string;
    id: string;
    createdFor: string[];
    courseAdditionalInfo: any;
    endDate: string;
    description: string;
    participant: any;
    updatedDate: string;
    createdDate: string;
    mentors: string[];
    name: string;
    enrollmentType: string;
    courseId: string;
    startDate: string;
    hashTagId: string;
    status: number;
    courseCreator: string;
    createdBy: string;
    creatorDetails?: {
        firstName?: string;
        lastName?: string;
    };
    enrollmentEndDate?: string;
    cert_templates: any;
}

export interface CourseCertificate {
    identifier?: string;
    url?: string;
    id?: string;
    name: string;
    lastIssuedOn: string;
    token: string;
}

export interface Course {
    dateTime?: string;
    identifier?: string;
    lastReadContentStatus?: number;
    enrolledDate?: string;
    addedBy?: string;
    contentId?: string;
    active?: boolean;
    description?: string;
    courseLogoUrl?: string;
    batchId?: string;
    userId?: string;
    content?: Content;
    contentStatus?: string;
    courseName?: string;
    leafNodesCount?: number;
    progress?: number;
    id?: string;
    lastReadContentId?: string;
    courseId?: string;
    status?: number;
    contentsPlayedOffline?: string[];
    batch?: { [key: string]: any };
    completionPercentage?: number;
    certificates?: CourseCertificate[];
    issuedCertificates?: CourseCertificate[];
    batches?: (Partial<Batch>)[];
}
