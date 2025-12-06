import { NextFunction, Request, Response } from 'express';

import { IMiddleware } from './middleware.interface.js';
import multer, {diskStorage} from 'multer';
import {extension} from 'mime-types';
import {nanoid} from 'nanoid';

export class UploadFileMiddleware implements IMiddleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private isMultipleFiles?: boolean,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${fileExtension}`);
      }
    });

    const uploadSingleFileMiddleware = multer({ storage })
      .single(this.fieldName);

    const uploadMultipleFilesMiddleware = multer({ storage }).array(this.fieldName);

    if (this.isMultipleFiles) {
      uploadMultipleFilesMiddleware(req, res, next);
    } else {
      uploadSingleFileMiddleware(req, res, next);
    }
  }
}
