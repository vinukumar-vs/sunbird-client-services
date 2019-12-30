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
    creatorFirstName?: string;
    creatorLastName?: string;
    enrollmentEndDate?: string;
}
export interface CourseCertificate {
    name: string;
    lastIssuedOn: string;
    url: string;
    token: string;
    id: string;
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
    courseName?: string;
    leafNodesCount?: number;
    progress?: number;
    id?: string;
    lastReadContentId?: string;
    courseId?: string;
    status?: number;
    contentsPlayedOffline?: string[];
    batch?: {
        [key: string]: any;
    };
    completionPercentage?: number;
    certificates?: CourseCertificate[];
}
