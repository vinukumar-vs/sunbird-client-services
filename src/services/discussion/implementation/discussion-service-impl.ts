
import {Container, inject, injectable} from 'inversify';
import {CsDiscussionServiceConfig} from '../../..';
import {Observable} from 'rxjs';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map, mergeMap} from 'rxjs/operators';
import { CsAttachForumRequest, CsAttachForumResponse, CsDiscussionService, CsGetContextBasedDiscussionRequest, CsGetContextBasedDiscussionResponse, CsRemoveForumRequest, CsRemoveForumResponse } from '../interface/cs-discussion-service';
import { CsFormService } from 'src/services/form/interface/cs-form-service';

@injectable()
export class DiscussionServiceImpl implements CsDiscussionService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.discussion.DISCUSSION_SERVICE_API_PATH) private apiPath: string,
        @inject(InjectionTokens.CONTAINER) private container: Container,
        @inject(InjectionTokens.services.form.FORM_SERVICE) private formService: CsFormService
    ) {
    }

    fetchAllTags(config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/tags`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                return r.body
            })
        );
        // const tags = this.http.get(urlConfig.getAllTags()).toPromise();
        // return tags;
    }

    createPost(data: any, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/v2/topics`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody(data)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
        // return this.http.post(urlConfig.createPost(), data);
    }
    // /**
    //  * @description To get all the categories
    //  */
    fetchAllCategories(config?: CsDiscussionServiceConfig) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/categories`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                return r.body
            })
        );
    }

    fetchSingleCategoryDetails(cid: any, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/category/${cid}`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                return r.body
            })
        );
        // return this.http.get<NSDiscussData.ICategorie>(urlConfig.getSingleCategoryDetails(cid));
    }

    // fetchSingleCategoryDetailsSort(cid: number, sort: any, page?: any) {
    //     const url = this.appendPage(page, urlConfig.getSingleCategoryDetails(cid));
    //     return this.http.get(`${url}&sort=${sort}`);
    // }

    votePost(pid: number,  data, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/v2/posts/${pid}/vote`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody(data)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    deleteVotePost(pid: number, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.DELETE)
            .withPath(`${config ? config.apiPath : this.apiPath}/v2/posts/${pid}/vote`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    bookmarkPost(pid: number, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/v2/posts/${pid}/bookmark`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    deleteBookmarkPost(pid: number, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.DELETE)
            .withPath(`${config ? config.apiPath : this.apiPath}/v2/posts/${pid}/bookmark`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    replyPost(tid: number, data: any, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.POST)
            .withPath(`${config ? config.apiPath : this.apiPath}/v2/topics/${tid}`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody(data)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    fetchRecentD(page?: any, config?) {
        // const url = this.appendPage(page, urlConfig.recentPost());
        // return this.http.get(url);
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/topics/recent/?page=${page}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                return r.body
            })
        );
    }

    // fetchPopularD(page?: any, config?) {
    //     // const url = this.appendPage(page, urlConfig.popularPost());
    //     // return this.http.get(url);
    //     const apiRequest: CsRequest = new CsRequest.Builder()
    //     .withType(CsHttpRequestType.GET)
    //     .withPath(`${config ? config.apiPath : this.apiPath}/topics/popular?page=${page}`)
    //     .withBearerToken(true)
    //     .withUserToken(true)
    //     .build();

    //     return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
    //         map((r) => {
    //             return r.body
    //         })
    //     );
    // }

    fetchTopicById(topicId: number, slug?: any, page?: any, config?) {
        // let url = urlConfig.getTopic() + '/' + topicId.toString() + '/' + slug;
        // url = this.appendPage(page, url);
        // return this.http.get(url);
        let url = '/topic/' + topicId.toString() + '/' + slug;
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}${url}?page=${page}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                return r.body
            })
        );
    }

    fetchTopicByIdSort(topicId: number, sort: any, page?: any, config?) {
        // let url = urlConfig.getTopic + topicId.toString();
        // url = this.appendPage(page, url);
        // return this.http.get(`${url}&sort=${sort}`);
        let url = '/topic/' + topicId.toString() + '/';
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}${url}?page=${page}&sort=${sort}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                return r.body
            })
        );
    }

    fetchUnreadCOunt(config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/topics/unread/total`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
        // return this.http.get<any>(urlConfig.unread());
    }

    // fetchProfile(config?) {
    //     const apiRequest: CsRequest = new CsRequest.Builder()
    //         .withType(CsHttpRequestType.GET)
    //         .withPath(`${config ? config.apiPath : this.apiPath}/users/me`)
    //         .withBearerToken(true)
    //         .withUserToken(true)
    //         .build();

    //     return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
    //         map((r) => r.body)
    //     );
    // }
    fetchProfileInfo(slug: string, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/users/${slug}/about`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }
    fetchUpvoted(slug, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/user/${slug}/upvoted`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
        // return this.http.get(urlConfig.listUpVote(urlConfig.userName));
    }
    fetchDownvoted(slug, config?) { // 0
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/user/${slug}/downvoted`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
        // return this.http.get(urlConfig.listDownVoted(urlConfig.userName));
    }
    fetchSaved(slug, config?) { // 0 this.usr.userId
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/user/${slug}/bookmarks`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
        // return this.http.get(urlConfig.listSaved(urlConfig.userName));
    }
    
    fetchNetworkProfile(slug, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/user/${slug}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
        // return this.http.get<any>(urlConfig.userdetails(urlConfig.userName));
    }

    getContextBasedTopic(slug: string, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/category/${slug}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
        // return this.http.get(urlConfig.getContextBasedTopics(slug));
    }

    createUser(data, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.POST)
        .withPath(`${config ? config.apiPath : this.apiPath}/user/v1/create`)
        .withBearerToken(true)
        .withUserToken(true)
        .withBody({
            request: {
                ...data
            }
        })
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    getForumIds(data, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.POST)
        .withPath(`${config ? config.apiPath : this.apiPath}/forum/v2/read`)
        .withBearerToken(true)
        .withUserToken(true)
        .withBody({
            request: {
                ...data
            }
        })
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    getUserDetails(username, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/user/${username}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    editPost(pid: number, data, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.POST)
        .withPath(`${config ? config.apiPath : this.apiPath}/v2/posts/${pid}`)
        .withBearerToken(true)
        .withUserToken(true)
        .withBody(data)
        .build();
        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    deletePost(pid: number, uid: number, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.DELETE)
            .withPath(`${config ? config.apiPath : this.apiPath}/v2/posts/${pid}?uid=${uid}`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();
        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    removeForum(data: CsRemoveForumRequest, config?: CsDiscussionServiceConfig): Observable<CsRemoveForumResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.POST)
        .withPath(`${config ? config.apiPath : this.apiPath}/forum/v2/remove`)
        .withBearerToken(true)
        .withUserToken(true)
        .withBody({
            request: {
                ...data
            }
        })
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    createForum(data: any, config?: CsDiscussionServiceConfig): Observable<CsAttachForumResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.POST)
        .withPath(`${config ? config.apiPath : this.apiPath}/forum/v3/create`)
        .withBearerToken(true)
        .withUserToken(true)
        .withBody(data)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    attachForum(request:CsAttachForumRequest): Observable<CsAttachForumResponse>{
        let createForumRequest;
        const req = {
            type: 'forum',
            action: 'create',
            subType: request.type
        };
        return this.formService.getForm(req).pipe(
            mergeMap((formData: any) => {
                createForumRequest = formData.data.fields[0];
                createForumRequest['category']['context'] = [request.context];
                return this.createForum(createForumRequest).pipe(
                    map((response:any) => response.result[0])
                )
            })
        )
    }

    deleteTopic(tid: number, config?: CsDiscussionServiceConfig): Observable<any> {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.DELETE)
        .withPath(`${config ? config.apiPath : this.apiPath}/v2/topics/${tid}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    editTopic(tid: number, data: any, config?: CsDiscussionServiceConfig): Observable<CsAttachForumResponse> {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.POST)
        .withPath(`${config ? config.apiPath : this.apiPath}/v2/topics/${tid}`)
        .withBearerToken(true)
        .withUserToken(true)
        .withBody(data)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }
      
}
