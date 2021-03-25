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
export interface CsGetForumIdsRequest {
}
// tslint:disable-next-line:no-empty-interface
export interface CsGetForumIdsResponse {
    result: any
}
// tslint:disable-next-line:no-empty-interface
export interface CsCreateUserRequest {
}
// tslint:disable-next-line:no-empty-interface
export interface CsCreateUserResponse {
    result: any
}

export interface CsAttachForumRequest {
    context: {
        type: string,
        identifier: string
      },
    type: string
}

export interface CsAttachForumResponse {
}

export interface CsRemoveForumRequest {
    sbType: string,
    sbIdentifier: string,
    cid: number
}

export interface CsRemoveForumResponse {
}

export interface CsGetContextBasedDiscussionRequest {
}

export interface CsGetContextBasedDiscussionResponse {
}


export interface CsDiscussionService {
    // appendPage(page: any, url: string);
    
    fetchAllTags(config?: CsDiscussionServiceConfig): Observable<any>;
    
    createPost(data: any, config?: CsDiscussionServiceConfig): Observable<any>;
     
    fetchAllCategories(config?: CsDiscussionServiceConfig): Observable<any>;

    fetchSingleCategoryDetails(cid, config?: CsDiscussionServiceConfig): Observable<any>;

    // fetchAllTag(config?);

    // fetchPostDetails(config?);

    votePost(pid: number, data, config?: CsDiscussionServiceConfig): Observable<any>;

    deleteVotePost(pid: number, config?: CsDiscussionServiceConfig): Observable<any>;

    bookmarkPost(pid: number, config?: CsDiscussionServiceConfig): Observable<any>;

    deleteBookmarkPost(pid: number, config?: CsDiscussionServiceConfig): Observable<any>;

    replyPost(tid: number, data: any, config?: CsDiscussionServiceConfig): Observable<any>;

    fetchRecentD(page?: any, config?: CsDiscussionServiceConfig): Observable<any>;

    // fetchPopularD(page?: any, config?: CsDiscussionServiceConfig): Observable<any>;

    fetchTopicById(topicId: number, slug?: any, page?: any, config?: CsDiscussionServiceConfig): Observable<any>;

    fetchTopicByIdSort(topicId: number, sort: any, page?: any, config?: CsDiscussionServiceConfig): Observable<any>;

    fetchUnreadCOunt(config?: CsDiscussionServiceConfig): Observable<any>;

    // fetchProfile(config?: CsDiscussionServiceConfig): Observable<any>;

    fetchProfileInfo(slug: string, config?: CsDiscussionServiceConfig): Observable<any>;

    fetchUpvoted(slug: string, config?: CsDiscussionServiceConfig): Observable<any>;

    fetchDownvoted(slug: string, config?: CsDiscussionServiceConfig): Observable<any>;

    fetchSaved(slug: string, config?: CsDiscussionServiceConfig): Observable<any>;

    // fetchSingleCategoryDetails(cid: number, page?: any);

    // fetchSingleCategoryDetailsSort(cid: number, sort: any, page?: any);

    fetchNetworkProfile(slug: string, config?: CsDiscussionServiceConfig): Observable<any>;

    getContextBasedTopic(slug: string, config?: CsDiscussionServiceConfig): Observable<any>;

    createUser(data: any, config?: CsDiscussionServiceConfig): Observable<any>;

    getForumIds(data: CsGetForumIdsRequest, config?: CsDiscussionServiceConfig): Observable<CsGetForumIdsResponse>;

    getUserDetails(data: any, config?: CsDiscussionServiceConfig): Observable<any>;

    getContextBasedTopic(uid: string, config?: CsDiscussionServiceConfig): Observable<any>;

    editPost(pid: number, data: any, config?: CsDiscussionServiceConfig): Observable<any>;

    deletePost(pid: number, uid: number, config?: CsDiscussionServiceConfig): Observable<any>;

    attachForum( data: CsAttachForumRequest): Observable<CsAttachForumResponse>;

    removeForum(data: CsRemoveForumRequest, config?: CsDiscussionServiceConfig): Observable<CsRemoveForumResponse>;

    createForum( data: any, config?: CsDiscussionServiceConfig): Observable<CsAttachForumResponse>;

    deleteTopic( tid: number, config?: CsDiscussionServiceConfig): Observable<any>;

    editTopic(tid: number, data: any, config?: CsDiscussionServiceConfig): Observable<any>;
}
