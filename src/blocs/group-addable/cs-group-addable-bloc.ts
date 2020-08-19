import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {CsPageContextBloc, CsPageContextState} from '..';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';

export interface CsGroupAddableState {
  pageContextState: CsPageContextState;
  addable: boolean;
  params?: { [key: string]: any };
}

export interface CsGroupAddableContextFactory {
  provide(pageContextState?: CsPageContextState): CsGroupAddableState | undefined;
}

class DefaultGroupAddableContextFactory implements CsGroupAddableContextFactory {
  provide(pageContextState?: CsPageContextState): CsGroupAddableState | undefined {
    if (!pageContextState) {
      return undefined;
    }

    return {
      pageContextState: pageContextState,
      addable: true,
      params: {}
    };
  }
}

export class CsGroupAddableBloc {
  private pageContextBloc: CsPageContextBloc;
  private pageContextBlocSubscription: Subscription;

  private static _instance: CsGroupAddableBloc;

  static get instance(): CsGroupAddableBloc {
    if (!this._instance) {
      this._instance = new CsGroupAddableBloc();
    }

    return this._instance;
  }

  public get state(): CsGroupAddableState | undefined {
    return this._state$.getValue();
  }

  private _groupAddableContextFactory: CsGroupAddableContextFactory;

  public get groupAddableContextFactory(): CsGroupAddableContextFactory {
    return this._groupAddableContextFactory;
  }

  private _state$: BehaviorSubject<CsGroupAddableState | undefined>;

  public get state$(): Observable<CsGroupAddableState | undefined> {
    return this._state$.asObservable().pipe(
      distinctUntilChanged()
    );
  }

  private _initialised = false;

  public get initialised(): boolean {
    return this._initialised;
  }

  init() {
    this.pageContextBloc = CsPageContextBloc.instance;
    this._groupAddableContextFactory = new DefaultGroupAddableContextFactory();
    this._state$ = new BehaviorSubject<CsGroupAddableState | undefined>(
      this._groupAddableContextFactory.provide(this.pageContextBloc.state)
    );

    this.pageContextBlocSubscription = this.pageContextBloc.state$.pipe(
      map((pageContextState) => this._groupAddableContextFactory.provide(pageContextState)),
      tap((groupAddableState) => this._state$.next(groupAddableState))
    ).subscribe();
  }

  setContextFactory(factory: CsGroupAddableContextFactory) {
    this._groupAddableContextFactory = factory;
    this._state$.next(this._groupAddableContextFactory.provide(this.pageContextBloc.state));
  }

  dispose() {
    this.pageContextBlocSubscription.unsubscribe();
    this._state$.complete();
  }
}
