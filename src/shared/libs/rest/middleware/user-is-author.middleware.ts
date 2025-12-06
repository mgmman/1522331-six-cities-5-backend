import { NextFunction, Request, Response } from 'express';

import { IMiddleware } from './middleware.interface.js';
import { ICheckUserIsAuthor } from '../../../types/check-user-is-author.service.js';
import { HttpError } from '../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';

export class UserIsAuthorMiddleware implements IMiddleware {
  constructor(
    private readonly service: ICheckUserIsAuthor,
    private readonly documentIdFieldName: string,
    private readonly authorfieldName: string,
  ) {}

  public async execute({ params, tokenPayload }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.documentIdFieldName];
    if (! await this.service.checkUserIsAuthor(documentId, tokenPayload.id)) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `${this.authorfieldName} is not an author of requested document`,
        'UserIsAuthorMiddleware'
      );
    }

    next();
  }
}
