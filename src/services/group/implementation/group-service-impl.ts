import {inject, injectable} from 'inversify';
import {CsHttpService} from '../../../core/http-service/interface';
import {CsGroupService} from '../interface';
import {InjectionTokens} from '../../../injection-tokens';
import {Group} from '../../../models/group';
import {defer, Observable} from 'rxjs';
import {User} from '../../../models/user';

@injectable()
export class GroupServiceImpl implements CsGroupService {

    static baseGroup: Group = {
        identifier: '5eb81793d75f7d4061da7b95',
        name: 'classRoom - 75',
        description: 'Tempor amet veniam do quis id incididunt occaecat.',
        objectType: 'Class',
        status: 'Live',
        versionKey: '1588778384610',
        channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
        framework: 'tpd',
        board: 'CBSE',
        subject: 'Math',
        gradeLevel: 'Grade 5',
        medium: 'English',
        createdOn: '2020-05-06T15:16:38.655+0000',
        lastUpdatedOn: '2020-05-06T15:19:44.610+0000',
        createdBy: '8454cb21-3ce9-4e30-85b5-fade097880d8',
        members: []
    };
    static baseUser: Partial<User> = {
        id: '8454cb21-3ce9-4e30-85b5-fade097880d8',
        userId: '8454cb21-3ce9-4e30-85b5-fade097880d8',
        identifier: '8454cb21-3ce9-4e30-85b5-fade097880d8',
        firstName: 'Some First Name',
        lastName: 'Some Last Name'
    };
    private db: Map<string, Group> = new Map<string, Group>();

    constructor(
        @inject(InjectionTokens.core.HTTP_SERVICE) private httpService: CsHttpService) {
    }

    static create_UUID() {
        let dt = new Date().getTime();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // tslint:disable-next-line:no-bitwise
            const r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            // tslint:disable-next-line:no-bitwise
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    create(
        name: string,
        board: string,
        medium: string | string[],
        gradeLevel: string | string[],
        subject: string | string[]
    ): Observable<Group> {
        return defer(async () => {
            const identifier = GroupServiceImpl.create_UUID();

            const group: Group = {
                ...GroupServiceImpl.baseGroup,
                identifier,
                name,
                board,
                medium,
                gradeLevel,
                subject
            };

            this.db.set(identifier, group);

            return group;
        });
    }

    deleteById(id: string): Observable<void> {
        return defer(async () => {
            this.db.delete(id);
        });
    }

    getAll(): Observable<Group[]> {
        return defer(async () => {
            return Array.from(this.db.values());
        });
    }

    getById(id: string): Observable<Group> {
        return defer(async () => {
            const group = this.db.get(id);

            if (!group) {
                throw new Error('NO_GROUP_FOUND');
            }

            return group;
        });
    }

    addMemberById(memberId: string, groupId: string): Observable<Group> {
        return defer(async () => {
            const group = this.db.get(groupId);

            if (!group) {
                throw new Error('NO_GROUP_FOUND');
            }

            const user: User = {
                ...GroupServiceImpl.baseUser,
                id: memberId,
                identifier: memberId,
                userId: memberId,
            } as User;
            group.members.push(user);
            return group;
        });
    }

    removeMemberById(memberId: string, groupId: string): Observable<void> {
        return defer(async () => {
            const group = this.db.get(groupId);

            if (!group) {
                throw new Error('NO_GROUP_FOUND');
            }

            group.members = group.members.filter((member) => member.id !== memberId);
        });
    }
}
