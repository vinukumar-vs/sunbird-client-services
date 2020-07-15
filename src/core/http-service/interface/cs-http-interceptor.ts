import {CsRequestInterceptor} from './cs-request-interceptor';
import {CsResponseInterceptor} from './cs-response-interceptor';

export interface CsHttpInterceptor extends CsRequestInterceptor, CsResponseInterceptor {
}
