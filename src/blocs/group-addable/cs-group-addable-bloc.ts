import {BehaviorSubject, Observable, of} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';

export interface CsGroupAddableState {
  pageIds: string[];
  groupId: string;
  params?: { [key: string]: any };
}

export class CsGroupAddableBloc {
  private static _instance: CsGroupAddableBloc;

  static get instance(): CsGroupAddableBloc {
    if (!this._instance) {
      this._instance = new CsGroupAddableBloc();
    }

    return this._instance;
  }

  public get state(): CsGroupAddableState | undefined {
    return this._state$ ? this._state$.getValue() : undefined;
  }

  private _state$?: BehaviorSubject<CsGroupAddableState | undefined>;

  public get state$(): Observable<CsGroupAddableState | undefined> {
    return this._state$ ? this._state$.asObservable().pipe(
        distinctUntilChanged()
    ) : of(undefined);
  }

  private _initialised = false;

  public get initialised(): boolean {
    return this._initialised;
  }

  init() {
    this._state$ = new BehaviorSubject<CsGroupAddableState | undefined>(undefined);
    this._initialised = true;
  }

  updateState(state: CsGroupAddableState) {
    if (this._state$) {
      this._state$.next(state);
    }
  }

  dispose() {
    if (this._state$) {
      this._state$.next(undefined);
      this._state$.complete();
      this._state$ = undefined;
    }
    this._initialised = false;
  }
}
