import { injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { IController } from './controller.interface.js';
import { ILogger } from '../../logger/index.js';
import { IRoute } from '../types/route.interface.js';
import { PathTransformer } from '../path-transformer/path-transformer.js';

const DEFAULT_CONTENT_TYPE = 'application/json';

@injectable()
export abstract class ControllerBase implements IController {
  private readonly _router: Router;

  protected constructor(
    protected readonly logger: ILogger,
    protected readonly pathTransformer: PathTransformer,
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: IRoute) {
    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));
    const middlewareHandlers = route.middlewares?.map(
      (item) => asyncHandler(item.execute.bind(item))
    );
    const allHandlers = [...middlewareHandlers ?? [], wrapperAsyncHandler];
    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    const modifiedData = this.pathTransformer.execute(data as Record<string, unknown>);
    res
      .type(DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(modifiedData);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
