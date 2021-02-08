import {
    ActivitiesGrouped,
    CsGroup,
    CsGroupActivity,
    CsGroupMember,
    GroupEntityStatus, GroupMemberRole,
    GroupMembershipType
} from './index';
describe('Group Class', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to create an instance from plain JSON', () => {
        const instance = CsGroup.fromJSON({
            name: 'SOME_GROUP_NAME',
            description: 'SOME_DESCRIPTION',
            id: 'SOME_ID',
            status: GroupEntityStatus.ACTIVE,
            membershipType: GroupMembershipType.INVITE_ONLY,
            activitiesGrouped: [],
            members: [
                {
                    name: 'SAMPLE_NAME',
                    groupId: 'SAMPLE_GROUP_ID',
                    userId: 'SAMPLE_USER_ID',
                    role: GroupMemberRole.ADMIN,
                    status: GroupEntityStatus.ACTIVE
                },
                {
                    name: 'SAMPLE_NAME',
                    groupId: 'SAMPLE_GROUP_ID',
                    userId: 'SAMPLE_USER_ID',
                    role: GroupMemberRole.ADMIN,
                    status: GroupEntityStatus.ACTIVE
                }
            ],
            activities: [
                {
                    id: 'SAMPLE_ID',
                    type: 'SAMPLE_TYPE'
                },
                {
                    id: 'SAMPLE_ID',
                    type: 'SAMPLE_TYPE'
                }
            ],
        });

        expect(instance instanceof CsGroup).toBeTruthy();

        if (instance.members) {
            instance.members.forEach((m) => {
                expect(m instanceof CsGroupMember).toBeTruthy();
            });
        }

        if (instance.activities) {
            instance.activities.forEach((m) => {
                expect(m instanceof CsGroupActivity).toBeTruthy();
            });
        }
    });
});
