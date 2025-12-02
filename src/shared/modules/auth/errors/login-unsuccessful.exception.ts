import { StatusCodes } from 'http-status-codes';
import { BaseUserException } from './base-user.exception.js';

export class LoginUnsuccessfulException extends BaseUserException {
  constructor() {
    super(StatusCodes.FORBIDDEN, 'Incorrect user name or password');
  }
}
