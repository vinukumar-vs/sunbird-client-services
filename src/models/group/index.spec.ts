import { plainToClass } from 'class-transformer';
import { CsGroup } from './index';
describe('Group Class', () => {
    let csGroup: CsGroup;
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        csGroup = plainToClass(CsGroup, {});
        expect(csGroup).toBeTruthy();
    });

    it('should return "TRUE" when group status = "active"', () => {
        csGroup = plainToClass(CsGroup, {status: 'active'});
        const isActive = csGroup.isGroupActive();
        expect(isActive).toEqual(true);
    });

    it('should return "FALSE" when group status != "active"', () => {
        csGroup = plainToClass(CsGroup, {status: 'suspended'});
        const isActive = csGroup.isGroupActive();
        expect(isActive).toEqual(false);
    });
});
