import {CsError} from '../../cs-error';

export class CsRequestBuilderError extends CsError {
  constructor(message: string) {
    super(message, 'REQUEST_BUILD_ERROR');

    Object.setPrototypeOf(this, CsRequestBuilderError.prototype);
  }
}
