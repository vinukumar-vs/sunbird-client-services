import {Observable} from 'rxjs';
import {Course} from '../../../models/course';
import {CsCourseServiceConfig} from '../../../index';

export interface GetUserEnrollmentListRequests {
    userId: string;
    filters?: {
        board?: string[];
        medium?: string[];
        gradeLevel?: string[];
        subject?: string[];
    };
}

export interface CsCourseService {
    getUserEnrollmentList(request: GetUserEnrollmentListRequests, additionalParams?: { [key: string]: string }, config?: CsCourseServiceConfig): Observable<Course[]>;
}
