import {Observable} from 'rxjs';
import {CsDiscussionServiceConfig} from '../../../index';

// export interface CsGroupCreateRequest {
//     name: string;
//     membershipType?: GroupMembershipType;
//     description: string;
// }

// export interface CsGroupCreateResponse {
//     groupId: string;
// }

// export interface CsGroupUpdateRequest {
//     name?: string;
//     membershipType?: GroupMembershipType;
//     description?: string;
//     status?: GroupEntityStatus;
// }

// tslint:disable-next-line:no-empty-interface
// export interface CsGroupUpdateResponse {
// }


export interface CsDiscussionService {
    // appendPage(page: any, url: string);
    
    fetchAllTags(config?): Observable<any>;
    
    createPost(data: any, config?): Observable<any>;
     
    fetchAllCategories(config?: CsDiscussionServiceConfig): Observable<any>;

    fetchSingleCategoryDetails(cid, config?): Observable<any>;

    // fetchAllTag(config?);

    // fetchPostDetails(config?);

    votePost(pid: number, data, config?): Observable<any>;

    deleteVotePost(pid: number, config?): Observable<any>;

    bookmarkPost(pid: number, config?): Observable<any>;

    deleteBookmarkPost(pid: number, config?): Observable<any>;

    replyPost(tid: number, data: any, config?): Observable<any>;

    fetchRecentId(page?: any, config?): Observable<any>;

    fetchPopularId(page?: any, config?): Observable<any>;

    fetchTopicById(topicId: number, slug?: any, page?: any, config?): Observable<any>;

    fetchTopicByIdSort(topicId: number, sort: any, page?: any, config?): Observable<any>;

    fetchUnreadCOunt(config?): Observable<any>;

    fetchProfile(config?): Observable<any>;

    fetchProfileInfo(slug: string, config?): Observable<any>;

    fetchUpvoted(slug: string, config?): Observable<any>;

    fetchDownvoted(slug: string, config?): Observable<any>;

    fetchSaved(slug: string, config?): Observable<any>;

    // fetchSingleCategoryDetails(cid: number, page?: any);

    // fetchSingleCategoryDetailsSort(cid: number, sort: any, page?: any);

    fetchNetworkProfile(slug: string, config?): Observable<any>;

    getContextBasedTopic(slug: string, config?): Observable<any>;

    createUser(data: any, config?): Observable<any>;

    getForumIds(data: any, config?): Observable<any>;

    getUserDetails(data: any, config?): Observable<any>;

    getContextBasedTopic(uid: string, config?): Observable<any>;
}
