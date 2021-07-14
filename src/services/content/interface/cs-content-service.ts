import { Observable } from 'rxjs';
import { CsContentServiceConfig } from '../../../index';

export interface CsContentGetQuestionSetResponse {
}

export interface CsContentGetQuestionListResponse {
}

export interface CsContentGetQuestionSetHierarchyResponse {
     
}
export interface CsContentService {
    getQuestionSetHierarchy(contentId: string, config?: CsContentServiceConfig): Observable<CsContentGetQuestionSetHierarchyResponse>;
    getQuestionSetRead(contentId: string, params?:any,  config?: CsContentServiceConfig): Observable<CsContentGetQuestionSetResponse>;
    getQuestionList(contentIds: string[], config?: CsContentServiceConfig): Observable<CsContentGetQuestionListResponse>;
}
