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

export interface CsCourseService {
    getUserEnrolledCourses(request: GetUserEnrolledCoursesRequest, additionalParams?: { [key: string]: string }, config?: CsCourseServiceConfig): Observable<Course[]>;

    getSignedCourseCertificate(certificateId: string, config?: CsCourseServiceConfig): Observable<CertificateUrlResponse>;
}
