import {RequestInterceptor} from './request-interceptor';
import {ResponseInterceptor} from './response-interceptor';

export interface HttpInterceptor extends RequestInterceptor, ResponseInterceptor {
}
