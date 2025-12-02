import { inject, injectable } from 'inversify';
import cors from 'cors';
import { ILogger } from '../shared/libs/logger/index.js';
import { IConfig, RestSchema } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { IDatabaseClient } from '../shared/libs/db-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import express, {Express} from 'express';
import {IController, IExceptionFilter} from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.Config) private readonly config: IConfig<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: IDatabaseClient,
    @inject(Component.OfferController) private readonly offersController: IController,
    @inject(Component.ExceptionFilter) private readonly appExceptionFilter: IExceptionFilter,
    @inject(Component.UserController) private readonly userController: IController,
  ) {
    this.server = express();
  }

  private async _initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  private async _initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use('/offers', this.offersController.router);
    this.server.use('/users', this.userController.router);
  }

  private async _initMiddleware() {
    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY'))
    );
    this.server.use(cors());
  }

  private async _initExceptionFilters() {
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization');

    this.logger.info('Initializing database…');
    await this._initDb();
    this.logger.info('Initializing database completed');

    this.logger.info('Init app-level middleware');
    await this._initMiddleware();
    this.logger.info('App-level middleware initialization completed');

    this.logger.info('Init controllers');
    await this._initControllers();
    this.logger.info('Controller initialization completed');

    this.logger.info('Init exception filters');
    await this._initExceptionFilters();
    this.logger.info('Exception filters initialization completed');

    this.logger.info('Try to init server…');
    await this._initServer();
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
