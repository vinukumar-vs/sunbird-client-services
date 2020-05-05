import {CsError} from '../../cs-error';

export class RequestBuildError extends CsError {
  constructor(message: string) {
    super(message, 'REQUEST_BUILD_ERROR');

    Object.setPrototypeOf(this, RequestBuildError.prototype);
  }
}
