import {Observable} from 'rxjs';
import {Course} from '../../../models/course';
import {CsCourseServiceConfig} from '../../../index';

export interface GetUserEnrolledCoursesRequest {
    userId: string;
    filters?: {
        board?: string[];
        medium?: string[];
        gradeLevel?: string[];
        subject?: string[];
    };
}

export interface CertificateUrlResponse {
    printUri: string;
}

type ContentStateRequestFields = 'progress' | 'score';

export interface GetContentStateRequest {
    userId: string;
    courseId: string;
    batchId: string;
    contentIds: string[];
    fields?: ContentStateRequestFields[];
}

export enum ContentStateStatus {
    IN_PROGRESS = 1,
    COMPLETED = 2
}

export interface ContentStateScore {
    attemptId: string;
    lastAttemptedOn: string;
    totalMaxScore: number;
    totalScore: number;
}

export interface ContentState {
    id: string;
    contentVersion: string;
    userId: string;
    lastAccessTime: string;
    contentId: string;
    progress: number;
    viewCount: number;
    completedCount: number;
    batchId: string;
    courseId: string;
    collectionId: string;
    lastCompletedTime: string;
    status: ContentStateStatus;
    score?: ContentStateScore[];
    bestScore?: ContentStateScore;
}

export interface CsCourseService {
    getUserEnrolledCourses(request: GetUserEnrolledCoursesRequest, additionalParams?: { [key: string]: string }, config?: CsCourseServiceConfig): Observable<Course[]>;

    getSignedCourseCertificate(certificateId: string, config?: CsCourseServiceConfig): Observable<CertificateUrlResponse>;

    getContentState(request: GetContentStateRequest, config?: CsCourseServiceConfig): Observable<ContentState[]>;
}
