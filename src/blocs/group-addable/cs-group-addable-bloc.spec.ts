import {CsGroupAddableBloc, CsGroupAddableState} from '..';
import {reduce} from 'rxjs/operators';

describe('CsContentContextBloc', () => {
    let csGroupAddableBloc: CsGroupAddableBloc;

    beforeEach(() => {
        csGroupAddableBloc = CsGroupAddableBloc.instance;
    });

    it('should be a singleton', () => {
        expect(csGroupAddableBloc).toEqual(CsGroupAddableBloc.instance);
  });

  describe('init/dispose', () => {
    it('should be able to use the class between init and dispose lifecycles', (done) => {
        csGroupAddableBloc.init();

        csGroupAddableBloc.state$.pipe(
            reduce((acc, state) => {
                acc.push(state);
                return acc;
            }, [] as (CsGroupAddableState | undefined)[])
        ).subscribe((events) => {
            expect(events).toEqual([
                undefined,
                {
                    pageIds: ['page-id-1', 'page-id-2'],
                    groupId: 'some_group_id',
                    params: {sample: 'param'}
                },
                undefined
            ]);
            done();
        });

        csGroupAddableBloc.updateState({
            pageIds: ['page-id-1', 'page-id-2'],
            groupId: 'some_group_id',
            params: {sample: 'param'}
        });

        csGroupAddableBloc.dispose();
    });
  });
});
