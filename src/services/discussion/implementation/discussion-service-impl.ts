// import { CsGroupSuspendResponse, CsGroupReactivateResponse, CsGroupU pdateGroupGuidelinesResponse, CsGroupUpdateGroupGuidelinesRequest } from './../interface/cs-group-service';
import {Container, inject, injectable, optional} from 'inversify';
// import {
//     CsGroupAddActivitiesRequest,
//     CsGroupAddActivitiesResponse,
//     CsGroupAddMembersRequest,
//     CsGroupAddMembersResponse,
//     CsGroupCreateRequest,
//     CsGroupCreateResponse,
//     CsGroupDeleteResponse,
//     CsGroupRemoveActivitiesRequest,
//     CsGroupRemoveActivitiesResponse,
//     CsGroupRemoveMembersRequest,
//     CsGroupRemoveMembersResponse,
//     CsGroupSearchCriteria,
//     CsGroupSearchResponse,
//     CsGroupService,
//     CsGroupSupportedActivitiesFormField,
//     CsGroupUpdateActivitiesRequest,
//     CsGroupUpdateActivitiesResponse,
//     CsGroupUpdateMembersRequest,
//     CsGroupUpdateMembersResponse,
//     CsGroupUpdateRequest,
//     CsGroupUpdateResponse
// } from '../interface';
import {CsDiscussionServiceConfig, CsGroupServiceConfig} from '../../..';
import {Observable} from 'rxjs';
import {InjectionTokens} from '../../../injection-tokens';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {map, mergeMap} from 'rxjs/operators';
import { CsDiscussionService } from '../interface/cs-discussion-service';

@injectable()
export class DiscussionServiceImpl implements CsDiscussionService {
    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService,
        @inject(InjectionTokens.services.discussion.DISCUSSION_SERVICE_API_PATH) private apiPath: string,
        @inject(InjectionTokens.CONTAINER) private container: Container,
    ) {
    }



    // appendPage(page: any, url: string) {
    //     if (page) {
    //         return `${url}?page=${page}`;
    //     }
    //     return `${url}?page=1`;
    // }
    
    fetchAllTags(config?) {
        console.log('from csl', config)
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/tags`)
            .withBearerToken(false)
            .withUserToken(false)
            .withHeaders({'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Im1vYmlsZV9kZXZpY2V2Ml9rZXk0In0.eyJpc3MiOiJkZXYuc3VuYmlyZC5hcHAtMzU0MTI2Mjc1YjNkODZkMThkZDhjMTRkZjhjY2NkNTM4MjI2MWNlNiIsImlhdCI6MTYwODU1OTM0OH0.reBVGt4Wewyv1u8wqgRZu_a1B9mBM-NUIXMXGRtDgF1AzNbZeiIzG--gSn6CQKTJs_-nC4avplu_3DkUUeiVTr9RUvuh0wK0jI606QZ2fImSY_Wzo_TAylulR8FP-jJNSdzyvaTgyRpl8wBp0_Wk-Oh7RMP-gStCQeZZ1BTluauh31mIScWs2NaksVtvSHkV1pH5xa2wRpegwFxla73nRvjnSRicjaLAGyt44n7eBuJU2ADxJe3mVulkLahJXPLKZtf0NFupq39-OtokrdgHawMZw0md1mQmp_3hMkwSX43I57q8aszedW9TdpPIMC_Ek_wb0FL5jFH7NAMjSRreNw'})
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                console.log('-----',r)
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
            .withBody({
                request: {
                    data
                }
            })
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
        console.log('fetchAllCategories CSL', config)
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/categories`)
            .withBearerToken(false)
            .withUserToken(false)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                console.log('fetchAllCategories CSL result', r.body)
                return r.body
            })
        );
    }

    fetchSingleCategoryDetails(cid: any, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/category/${cid}`)
            .withBearerToken(false)
            .withUserToken(false)
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
            .withPath(`${config ? config.apapiPath : this.apiPath}/v2/posts/${pid}/vote`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    data
                }
            })
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
            .withPath(`${config ? config.bookmarkPost : this.apiPath}/v2/posts/${pid}/bookmark`)
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
            .withPath(`${config ? config.replyPost : this.apiPath}/v2/topics/${tid}`)
            .withBearerToken(true)
            .withUserToken(true)
            .withBody({
                request: {
                    data
                }
            })
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

    fetchPopularD(page?: any, config?) {
        // const url = this.appendPage(page, urlConfig.popularPost());
        // return this.http.get(url);
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/topics/popular?page=${page}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => {
                return r.body
            })
        );
    }

    fetchTopicById(topicId: number, slug?: any, page?: any, config?) {
        // let url = urlConfig.getTopic() + '/' + topicId.toString() + '/' + slug;
        // url = this.appendPage(page, url);
        // return this.http.get(url);
        let url = '/topic/' + topicId.toString() + '/' + slug;
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}${url}page=${page}`)
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
    fetchProfile(config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
            .withType(CsHttpRequestType.GET)
            .withPath(`${config ? config.apiPath : this.apiPath}/users/me`)
            .withBearerToken(true)
            .withUserToken(true)
            .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }
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
        .withPath(`${config ? config.apiPath : this.apiPath}/forumId`)
        .withBearerToken(true)
        .withUserToken(true)
        .withBody({
            request: {
                data
            }
        })
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }

    getUserDetails(uid, config?) {
        const apiRequest: CsRequest = new CsRequest.Builder()
        .withType(CsHttpRequestType.GET)
        .withPath(`${config ? config.apiPath : this.apiPath}/user/uid/${uid}`)
        .withBearerToken(true)
        .withUserToken(true)
        .build();

        return this.httpService.fetch<{ result: {} }>(apiRequest).pipe(
            map((r) => r.body)
        );
    }
}
