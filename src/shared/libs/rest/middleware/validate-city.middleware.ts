import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IMiddleware } from './middleware.interface.js';
import { HttpError } from '../errors/http-error.js';
import {City} from '../../../types';

export class ValidateCityMiddleware implements IMiddleware {
  constructor(private param: string) {}

  public execute({ params }: Request, _res: Response, next: NextFunction): void {
    const city = params[this.param];

    if (Object.values(City).includes(city)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${city} is invalid City`,
      'ValidateCityMiddleware'
    );
  }
}
