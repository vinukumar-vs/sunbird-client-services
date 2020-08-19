import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

export interface CsPageContextState {
  pageId: string;
  params?: { [key: string]: any };
}

export class CsPageContextBloc {
  private static _instance: CsPageContextBloc;
  static get instance(): CsPageContextBloc {
    if (!this._instance) {
      this._instance = new CsPageContextBloc();
    }

    return this._instance;
  }

  public get state(): CsPageContextState | undefined {
    return this._state$.getValue();
  }

  private _initialised = false;

  public get initialised(): boolean {
    return this._initialised;
  }

  private _state$: BehaviorSubject<CsPageContextState | undefined>;

  public get state$(): Observable<CsPageContextState | undefined> {
    return this._state$.asObservable().pipe(
      distinctUntilChanged((a, b) =>
        JSON.stringify(a) === JSON.stringify(b)
      )
    );
  }

  init() {
    this._state$ = new BehaviorSubject<CsPageContextState | undefined>(undefined);
    this._initialised = true;
  }

  updateState(newState: CsPageContextState | undefined) {
    this._state$.next(newState);
  }

  dispose() {
    this._state$.complete();
    this._initialised = false;
  }
}
