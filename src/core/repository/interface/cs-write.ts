import {Observable} from 'rxjs';

export interface CsWrite<T> {
    create<R>(request: R): Observable<boolean>;

    update<R>(request: R): Observable<boolean>;

    delete(id: string): Observable<boolean>;
}
