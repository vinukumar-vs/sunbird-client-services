import {inject, injectable} from 'inversify';
import {InjectionTokens} from '../../../index';
import {CsHttpService} from '../../../core/http-service/interface/cs-http-service';
import {ScClassRoomService} from '../interface';

@injectable()
export class ClassRoomServiceImpl implements ScClassRoomService {
    foo: 'bar';

    constructor(@inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService) {
    }
}
