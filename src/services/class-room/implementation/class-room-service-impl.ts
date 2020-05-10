import {inject, injectable} from 'inversify';
import {CsHttpRequestType, CsHttpService, CsRequest} from '../../../core/http-service/interface';
import {CsClassRoomService} from '../interface';
import {InjectionTokens} from '../../../injection-tokens';
import {ClassRoom} from '../../../models/class-room';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@injectable()
export class ClassRoomServiceImpl implements CsClassRoomService {
    private static configuration = {
        FIND_PATH: 'https://next.json-generator.com/api/json/get/E1J7EZW9_',
        FIND_ONE_PATH: 'https://next.json-generator.com/api/json/get/E1J7EZW9_'
    };

    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService) {
    }

    create<R = {}>(request = {}): Observable<boolean> {
        return of(true);
    }

    delete(id: string): Observable<boolean> {
        return of(true);
    }

    update<R>(request: R): Observable<boolean> {
        return of(true);
    }

    find<R = {}>(request = {}): Observable<ClassRoom[]> {
        return this.httpService.fetch<ClassRoom[]>(
            new CsRequest.Builder()
                .withType(CsHttpRequestType.GET)
                .withHost(ClassRoomServiceImpl.configuration.FIND_PATH)
                .withPath('')
                .withBearerToken(false)
                .withUserToken(false)
                .build()
        ).pipe(
            map((r) => r.body)
        );
    }

    findOne(id: string): Observable<ClassRoom> {
        return this.httpService.fetch<ClassRoom>(
            new CsRequest.Builder()
                .withType(CsHttpRequestType.GET)
                .withHost(ClassRoomServiceImpl.configuration.FIND_ONE_PATH)
                .withPath('')
                .withBearerToken(false)
                .withUserToken(false)
                .build()
        ).pipe(
            map((r) => r.body)
        );
    }
}
