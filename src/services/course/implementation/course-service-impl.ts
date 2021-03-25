import {
    CertificateUrlResponse, ContentState, ContentStateScore,
    CsCourseService,
    GetContentStateRequest,
    GetUserEnrolledCoursesRequest, CsUpdateContentStateRequest, CsUpdateContentStateResponse
} from '../interface';
import {Course} from '../../../models/course';
import {Observable} from 'rxjs';
import {CsCourseServiceConfig} from '../../../index';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {inject, injectable, optional} from 'inversify';
import {InjectionTokens} from '../../../injection-tokens';
import {map} from 'rxjs/operators';

@injectable()
export class CourseServiceImpl implements CsCourseService {
    constructor(
      @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
      @inject(InjectionTokens.services.course.COURSE_SERVICE_API_PATH) private apiPath: string,
      @optional() @inject(InjectionTokens.services.course.COURSE_SERVICE_CERT_REGISTRATION_API_PATH) private certRegistrationApiPath?: string
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

    getSignedCourseCertificate(certificateId: string, config?: CsCourseServiceConfig): Observable<CertificateUrlResponse> {
        if (!this.certRegistrationApiPath && (!config || !config.certRegistrationApiPath)) {
            throw new Error('Required certRegistrationApiPath configuration');
        }

        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath((config ? config.certRegistrationApiPath : this.certRegistrationApiPath) + '/download/' + certificateId)
            .withBearerToken(true)
            .withUserToken(true)
            .build();
        return this.httpService.fetch<{ result: { printUri: string } }>(apiRequest).pipe(
            map((response) => {
                return response.body.result;
            })
        );
    }

    getContentState(request: GetContentStateRequest, config?: CsCourseServiceConfig): Observable<ContentState[]> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath((config ? config.apiPath : this.apiPath) + '/content/state/read')
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({request})
            .build();

        return this.httpService.fetch<{ result: { contentList: ContentState[] } }>(apiRequest).pipe(
            map((response) => {
                return response.body.result.contentList.map((content: ContentState) => {
                    if (!content.score) {
                        return content;
                    }

                    content.bestScore = content.score.reduce<ContentStateScore | undefined>((acc: ContentStateScore | undefined, score: ContentStateScore) => {
                        if (!acc) {
                            return score;
                        }

                        if (acc.totalScore < score.totalScore) {
                            return score;
                        }

                        return acc;
                    }, undefined);

                    return content;
                });
            })
        );
    }

    updateContentState(request: CsUpdateContentStateRequest, config?: CsCourseServiceConfig): Observable<CsUpdateContentStateResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
          .withType(CsHttpRequestType.PATCH)
          .withPath((config ? config.apiPath : this.apiPath) + '/content/state/update')
          .withBearerToken(true)
          .withUserToken(true)
          .withBody({request})
          .build();

        return this.httpService.fetch<{ result: CsUpdateContentStateResponse }>(apiRequest)
          .pipe(
            map((response) => {
                return response.body.result;
            })
          );
    }
}
