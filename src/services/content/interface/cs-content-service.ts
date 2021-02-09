import { Observable } from 'rxjs';
import { CsContentServiceConfig } from '../../../index';

export interface CsContentGetQuestionSetResponse {
    contentId: string;
    // need to add
}

export interface CsContentService {
    getQuestionSet(contentId: string, config?: CsContentServiceConfig): Observable<CsContentGetQuestionSetResponse>;
}
