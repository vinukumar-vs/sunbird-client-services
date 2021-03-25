import { inject, injectable } from 'inversify';
import { CsContentGetQuestionSetResponse, CsContentService, CsContentGetQuestionListResponse } from '../interface';
import { CsContentServiceConfig } from '../../..';
import { Observable } from 'rxjs';
import { InjectionTokens } from '../../../injection-tokens';
import { CsHttpRequestType, CsHttpService, CsRequest } from '../../../core/http-service/interface';
import { map } from 'rxjs/operators';

@injectable()
export class ContentServiceImpl implements CsContentService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.content.CONTENT_SERVICE_HIERARCHY_API_PATH) private hierarchyApiPath: string,
        @inject(InjectionTokens.services.content.CONTENT_SERVICE_QUESTION_LIST_API_PATH) private questionListApiPath: string,
    ) {
    }

    getQuestionSetHierarchy(contentId: string, config?: CsContentServiceConfig): Observable<CsContentGetQuestionSetResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath((config ? config.hierarchyApiPath : this.hierarchyApiPath) + '/hierarchy/' + contentId + '?mode=edit')
            .withBearerToken(true)
            .withUserToken(true)
            .build();
        return this.httpService.fetch<{ result: { questionSet: { children: { identifier: string }[] } } }>(apiRequest).pipe(
            map((response) => {
                return response.body.result;
            })
        );
    }

    getQuestionList(contentIds: string[], config?: CsContentServiceConfig): Observable<CsContentGetQuestionListResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.questionListApiPath : this.questionListApiPath}/list`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    search: {
                        identifier: contentIds
                    },
                }
            })
            .build();
        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body.result)
        );
    }
}
