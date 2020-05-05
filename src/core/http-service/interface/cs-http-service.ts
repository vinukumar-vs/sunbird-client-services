import {Observable} from 'rxjs';
import {Request} from './request';
import {Response} from './response';

export interface CsHttpService {
    fetch<T>(request: Request): Observable<Response<T>>;
}
