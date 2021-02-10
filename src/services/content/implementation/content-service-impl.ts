import { inject, injectable } from 'inversify';
import { CsContentGetQuestionSetResponse, CsContentService } from '../interface';
import { CsContentServiceConfig } from '../../..';
import { defer, Observable } from 'rxjs';
import { InjectionTokens } from '../../../injection-tokens';
import { CsHttpRequestType, CsHttpService, CsRequest } from '../../../core/http-service/interface';

@injectable()
export class ContentServiceImpl implements CsContentService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.content.CONTENT_SERVICE_HIERARCHY_API_PATH) private hierarchyApiPath: string,
        @inject(InjectionTokens.services.content.CONTENT_SERVICE_SEARCH_API_PATH) private searchApiPath: string,
    ) {
    }

    getQuestionSet(contentId: string, config?: CsContentServiceConfig): Observable<CsContentGetQuestionSetResponse> {
        return defer(async () => {
            const apiRequest: CsRequest = new CsRequest.Builder()
                .withType(CsHttpRequestType.GET)
                .withPath((config ? config.hierarchyApiPath : this.hierarchyApiPath) + '/hierarchy/' + contentId + '?mode=edit')
                .withBearerToken(true)
                .withUserToken(true)
                .build();
            let hierarchyResponse = await this.httpService.fetch<{ result: { questionSet: { children: { identifier: string }[] } } }>(apiRequest).toPromise();
            const childIds = hierarchyResponse.body.result.questionSet.children.map(a => a.identifier);
            const searchRequest = {
                "filters": {
                    "status": [],
                    "identifier": childIds
                }
            };
            const searchApiRequest: CsRequest = new CsRequest.Builder()
                .withType(CsHttpRequestType.POST)
                .withPath((config ? config.searchApiPath : this.searchApiPath) + '/search/')
                .withBearerToken(true)
                .withUserToken(true)
                .withBody({
                    request: searchRequest
                })
                .build();
            const searchResponse = await this.httpService.fetch<{ result: { Question: [] } }>(searchApiRequest).toPromise();
            hierarchyResponse.body.result.questionSet.children = searchResponse.body.result.Question;
            return {
                response: hierarchyResponse.body.result
            };
        });
    }
}
