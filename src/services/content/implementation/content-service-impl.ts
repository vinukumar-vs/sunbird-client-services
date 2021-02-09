import { inject, injectable } from 'inversify';
import { CsContentGetQuestionSetResponse, CsContentService } from '../interface';
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
        @inject(InjectionTokens.services.content.CONTENT_SERVICE_SEARCH_API_PATH) private searchApiPath: string,
    ) {
    }

    getQuestionSet(contentId: string, config?: CsContentServiceConfig): Observable<CsContentGetQuestionSetResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath((config ? config.hierarchyApiPath : this.hierarchyApiPath) + '/hierarchy/' + contentId)
            .withBearerToken(true)
            .withUserToken(true)
            .build();
        return this.httpService.fetch<{ result: { contentId: string } }>(apiRequest).pipe(
            map((response) => {
                return response.body.result;
            })
        );
    }




}
