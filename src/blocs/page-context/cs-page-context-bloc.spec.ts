import {CsPageContextBloc} from './cs-page-context-bloc';

describe('CsPageContextBloc', () => {
  let csPageContextBloc: CsPageContextBloc;

  beforeEach(() => {
    csPageContextBloc = CsPageContextBloc.instance;
  });

  it('should be a singleton', () => {
    expect(csPageContextBloc).toEqual(CsPageContextBloc.instance);
  });

  describe('init/dispose', () => {
    it('should be able to use the class between init and dispose lifecycles', (done) => {
      csPageContextBloc.init();

      csPageContextBloc.state$.subscribe({
        complete: () => {
          done();
        }
      });

      csPageContextBloc.updateState(undefined);

      csPageContextBloc.dispose();
    });
  });

  describe('state', () => {
    it('should return current CsPageContextState', (done) => {
      csPageContextBloc.init();

      csPageContextBloc.state$.subscribe({
        next: (v) => {
          expect(v).toEqual(csPageContextBloc.state);
        },
        complete: () => {
          done();
        }
      });

      csPageContextBloc.updateState(undefined);

      csPageContextBloc.dispose();
    });
  });
});
