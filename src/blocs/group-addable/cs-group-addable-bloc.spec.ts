import {CsGroupAddableBloc, CsGroupAddableContextFactory, CsGroupAddableState, CsPageContextBloc, CsPageContextState} from '..';

describe('CsContentContextBloc', () => {
  let csGroupAddableBloc: CsGroupAddableBloc;
  let csPageContextBloc: CsPageContextBloc;

  class AlwaysAddableContextFactory implements CsGroupAddableContextFactory {
    provide(pageContextState?: CsPageContextState): CsGroupAddableState | undefined {
      if (pageContextState) {
        return {
          pageContextState: pageContextState,
          addable: true
        };
      }

      return undefined;
    }
  }

  beforeEach(() => {
    csGroupAddableBloc = CsGroupAddableBloc.instance;
    csPageContextBloc = CsPageContextBloc.instance;
  });

  it('should be a singleton', () => {
    expect(csGroupAddableBloc).toEqual(CsGroupAddableBloc.instance);
  });

  describe('init/dispose', () => {
    it('should be able to use the class between init and dispose lifecycles', (done) => {
      csPageContextBloc.init();
      csGroupAddableBloc.init();

      csGroupAddableBloc.state$.subscribe({
        complete: () => {
          done();
        }
      });

      csGroupAddableBloc.dispose();
      csPageContextBloc.dispose();
    });
  });

  describe('setContextFactory', () => {
    it('should be able to set a ContextFactory', () => {
      csPageContextBloc.init();
      csGroupAddableBloc.init();

      csGroupAddableBloc.setContextFactory(new AlwaysAddableContextFactory());

      csGroupAddableBloc.dispose();
      csPageContextBloc.dispose();
    });
  });

  describe('state', () => {
    it('should return current CsContentContextState', (done) => {
      csPageContextBloc.init();
      csGroupAddableBloc.init();

      csPageContextBloc.updateState({
        pageId: 'page_id'
      });

      csGroupAddableBloc.state$.subscribe({
        next: (v) => {
          expect(v).toBeTruthy();
          expect(v).toEqual(csGroupAddableBloc.state);
          expect(v && v.addable).toEqual(true);
        },
        complete: () => {
          done();
        }
      });

      csGroupAddableBloc.setContextFactory(new AlwaysAddableContextFactory());

      csGroupAddableBloc.dispose();
      csPageContextBloc.dispose();
    });
  });
});
