import { IMiddleware } from './middleware.interface.js';
import { NextFunction, Request, Response } from 'express';
import { IDocumentExists } from '../../../types/index.js';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../errors/http-error.js';

export class DocumentExistsMiddleware implements IMiddleware {
  constructor(
    private readonly service: IDocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({ params }: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (! await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
