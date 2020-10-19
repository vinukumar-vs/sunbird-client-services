import { plainToClass } from 'class-transformer';
import { CsGroup, GroupEntityStatus } from './index';
describe('Group Class', () => {
    let csGroup: CsGroup;
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        csGroup = plainToClass(CsGroup, {status: 'active'});
        expect(csGroup).toBeTruthy();
        expect(csGroup.active).toEqual(true);
    });

    it('should return "TRUE" when group status = "active"', () => {
        csGroup = plainToClass(CsGroup, {status: 'active'});
        const isActive = csGroup.isActive();
        expect(isActive).toEqual(true);
    });

    it('should return "FALSE" when group status != "active"', () => {
        csGroup = plainToClass(CsGroup, {status: 'suspended'});
        csGroup.status = GroupEntityStatus.SUSPENDED;
        const isActive = csGroup.isActive();
        expect(isActive).toEqual(false);
    });
});
