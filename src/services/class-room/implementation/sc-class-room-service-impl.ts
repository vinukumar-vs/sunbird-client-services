import {ScClassRoomService} from '..';
import {inject, injectable} from 'inversify';
import {InjectionTokens} from '../../../index';
import {CsHttpService} from '../../../core/http-service/interface/cs-http-service';

@injectable()
export class ScClassRoomServiceImpl implements ScClassRoomService {
    foo: 'bar';

    constructor(@inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService) {
    }
}
