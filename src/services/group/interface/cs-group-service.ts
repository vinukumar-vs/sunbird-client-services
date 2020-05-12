import {Group} from '../../../models/group';
import {Observable} from 'rxjs';
import {CsGroupServiceConfig} from '../../../index';

export interface CsGroupService {
    create(
        name: string,
        board: string,
        medium: string | string[],
        gradeLevel: string | string[],
        subject: string | string[],
        config?: CsGroupServiceConfig
    ): Observable<Group>;

    deleteById(id: string, config?: CsGroupServiceConfig): Observable<void>;

    getAll(config?: CsGroupServiceConfig): Observable<Group[]>;

    getById(id: string, config?: CsGroupServiceConfig): Observable<Group>;

    addMemberById(memberId: string, groupId: string, config?: CsGroupServiceConfig): Observable<Group>;

    removeMemberById(memberId: string, groupId: string, config?: CsGroupServiceConfig): Observable<void>;
}
