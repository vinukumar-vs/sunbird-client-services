import { plainToClass } from 'class-transformer';
import { Group } from './index';
describe('Group Class', () => {
    let csGroup: Group;
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it('should be able to get an instance from the container', () => {
        csGroup = plainToClass(Group, {});
        expect(csGroup).toBeTruthy();
    });

    it('should return "TRUE" when group status = "active"', () => {
        csGroup = plainToClass(Group, {status: 'active'});
        const isActive = csGroup.isActive();
        expect(isActive).toEqual(true);
    });

    it('should return "FALSE" when group status != "active"', () => {
        csGroup = plainToClass(Group, {status: 'suspended'});
        const isActive = csGroup.isActive();
        expect(isActive).toEqual(false);
    });

    it('should change group status to "active"', () => {
        csGroup = new Group();
        csGroup.setStatus('active');
        expect(csGroup.status).toEqual('active');
    });

    it('should change group status to "suspended"', () => {
        csGroup = new Group();
        csGroup.setStatus('suspended');
        expect(csGroup.status).toEqual('suspended');
    });
});
