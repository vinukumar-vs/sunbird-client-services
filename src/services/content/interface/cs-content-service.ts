import { Observable } from 'rxjs';
import { CsContentServiceConfig } from '../../../index';

export interface CsContentGetQuestionSetResponse {
    response: {};
}

export interface CsContentService {
    getQuestionSet(contentId: string, config?: CsContentServiceConfig): Observable<CsContentGetQuestionSetResponse>;
}
