import {Observable} from 'rxjs';

export interface CsRead<T> {
    find<R>(request: R): Observable<T[]>;

    findOne(id: string): Observable<T>;
}
