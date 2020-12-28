import { CsGroup } from './../../../models/group/index';
import {Group, GroupEntityStatus, GroupMemberRole, GroupMembershipType} from '../../../models/group';
import {Observable} from 'rxjs';
import {CsDiscussionServiceConfig, CsGroupServiceConfig} from '../../../index';
import {Form} from '../../../models/form';

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
    
    fetchAllTags(config?);
    
    createPost(data: any, config?);
     
    fetchAllCategories(config?: CsDiscussionServiceConfig);

    fetchSingleCategoryDetails(cid, config?)

    // fetchAllTag(config?);

    // fetchPostDetails(config?);

    votePost(pid: number, data, config?);

    deleteVotePost(pid: number, config?);

    bookmarkPost(pid: number, config?);

    deleteBookmarkPost(pid: number, config?);

    replyPost(tid: number, data: any, config?);

    fetchRecentD(page?: any, config?);

    fetchPopularD(page?: any, config?);

    fetchTopicById(topicId: number, slug?: any, page?: any, config?);

    fetchTopicByIdSort(topicId: number, sort: any, page?: any, config?);

    fetchUnreadCOunt(config?);

    fetchProfile(config?);

    fetchProfileInfo(slug: string, config?);

    fetchUpvoted(slug: string, config?);

    fetchDownvoted(slug: string, config?);

    fetchSaved(slug: string, config?);

    // fetchSingleCategoryDetails(cid: number, page?: any);

    // fetchSingleCategoryDetailsSort(cid: number, sort: any, page?: any);

    fetchNetworkProfile(slug: string, config?);

    getContextBasedTopic(slug: string, config?);

    createUser(data: any, config?);

    getForumIds(data: any, config?);

    getUserDetails(data: any, config?);

    getContextBasedTopic(uid: string, config?);
}
