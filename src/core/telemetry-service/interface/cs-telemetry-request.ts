export interface IProducerdata {
    'id': string;
    'ver': string;
    'pid': string;
}

export interface IRollup {
    'l1': string;
    'l2': string;
}

export interface IContext {
    'env': string;
    'sid': string;
    'did': string;
    'channel'?: string;
    'cdata'?: Array<object>;
    'pdata'?: IProducerdata;
    'rollup'?: IRollup | any;
}

export interface IObject {
    'id'?: string;
    'type'?: string;
    'ver'?: string;
    'section'?: string;
    'rollup'?: IRollup | any;
}

export interface IActor {
    'id': string;
    'type': string;
}

export interface IEventInput {
    'eid': string;
    'ets': string;
    'ver'?: string;
    'actor'?: IActor;
    'context': IContext | any;
    'object'?: IObject | any;
    'tags'?: Array<String>;
    'edata'?: {};
    'mid': String;
}
export interface ITelemetry {
    'pdata': IProducerdata;
    'env': string;
    'apislug': string;
    'channel': string;
    'uid'?: string;
    'endpoint': string;
    'did'?: string;
    'authtoken'?: string;
    'sid'?: string;
    'batchsize'?: Number;
    'runningEnv'?: string;
    'mode'?: string;
    'host'?: string;
    'tags'?: Array<string>;
    'cdata'?: Array<{}>;
    'dispatcher'?: undefined;
    'enableValidation': boolean;
    'timeDiff'?: Number;
  }
  export interface ITelemetryContext {
    'config': ITelemetry;
    'userOrgDetails': any;
  }