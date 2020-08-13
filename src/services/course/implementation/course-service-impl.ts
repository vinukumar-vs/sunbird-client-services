import {CertificateUrlRequest, CertificateUrlResponse, CsCourseService, GetUserEnrolledCoursesRequest} from '../interface';
import {Course} from '../../../models/course';
import {Observable} from 'rxjs';
import {CsCourseServiceConfig} from '../../../index';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {inject, injectable} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {map} from 'rxjs/operators';

@injectable()
export class CourseServiceImpl implements CsCourseService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.course.COURSE_SERVICE_API_PATH) private apiPath: string,
        @inject(InjectionTokens.services.course.COURSE_SERVICE_CERT_REGISTRATION_API_PATH) private certRegistrationApiPath: string
    ) {
    }

    getUserEnrolledCourses(request: GetUserEnrolledCoursesRequest, additionalParams = {}, config?: CsCourseServiceConfig): Observable<Course[]> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath((config ? config.apiPath : this.apiPath) + '/user/enrollment/list')
            .withParameters(additionalParams)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({request})
            .build();

        return this.httpService.fetch<{ result: { courses: Course[] } }>(apiRequest)
            .pipe(
                map((response) => {
                    return response.body.result.courses;
                })
            );
    }

    getSignedCourseCertificate(request: CertificateUrlRequest, config?: CsCourseServiceConfig): Observable<CertificateUrlResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath((config ? config.certRegistrationApiPath : this.certRegistrationApiPath) + '/certs/download')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({request})
            .build();
        return this.httpService.fetch<{result: {signedUrl: string}}>(apiRequest).pipe(
            map((response) => {
                return response.body.result;
            })
        );
    }
}
