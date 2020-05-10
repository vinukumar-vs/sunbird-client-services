import {CsRead, CsWrite} from '../../../core/repository/interface';
import {ClassRoom} from '../../../models/class-room';

export interface CsClassRoomService extends CsRead<ClassRoom>, CsWrite<ClassRoom> {
}
