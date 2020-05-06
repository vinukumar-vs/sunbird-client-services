import {inject, injectable} from 'inversify';
import {CsHttpService} from '../../../core/http-service/interface/cs-http-service';
import {CsClassRoomService} from '../interface';
import {InjectionTokens} from '../../../injection-tokens';

@injectable()
export class ClassRoomServiceImpl implements CsClassRoomService {
    foo: 'bar';

    constructor(@inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService) {
    }
}
