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
    id?: string;
    userId?: string;
    contentId?: string;
    batchId?: string;
    courseId?: string;
    lastAccessTime?: string;
    viewCount?: number;
    completedCount?: number;
    collectionId?: string;
    lastCompletedTime?: string;
    status?: ContentStateStatus;
    contentVersion?: string;
    grade?: string;
    result?: string;
    progress?: number;
    score?: ContentStateScore[];
    bestScore?: ContentStateScore;
}

export interface CsUpdateContentStateRequest {
    userId: string;
    batchId: string;
    courseId: string;
    contentId?: string;
    status?: ContentStateStatus;
}

export interface CsUpdateContentStateResponse {
    response: string;
}

export interface CsCourseService {
    getUserEnrolledCourses(request: GetUserEnrolledCoursesRequest, additionalParams?: { [key: string]: string }, config?: CsCourseServiceConfig): Observable<Course[]>;

    getSignedCourseCertificate(certificateId: string, config?: CsCourseServiceConfig): Observable<CertificateUrlResponse>;

    getContentState(request: GetContentStateRequest, config?: CsCourseServiceConfig): Observable<ContentState[]>;

    updateContentState(request: CsUpdateContentStateRequest, config?: CsCourseServiceConfig): Observable<CsUpdateContentStateResponse>;
}
