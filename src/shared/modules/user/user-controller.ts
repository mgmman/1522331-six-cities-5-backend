import { inject, injectable } from 'inversify';
import {Request, Response} from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  ControllerBase,
  HttpError,
  HttpMethod,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { IUserService } from './user-service.interface.js';
import { IConfig, RestSchema } from '../../libs/config/index.js';
import { fillDTO } from '../../helpers/index.js';
import {CreateUserRequest} from './types/create-user-request.type';
import {UserRdo} from './rdo/user-rdo.js';
import {LoginUserRequest} from './types/login-user-request.type';
import {LoginUserDto} from './dto/login-user-dto.js';
import {CreateUserDto} from './dto/create-user-dto.js';
import {UploadFileMiddleware} from '../../libs/rest/middleware/upload-file.middleware.js';
import { IAuthService } from '../auth/auth-service.interface.js';
import {LoggedUserRdo} from './rdo/logged-user-rdo.js';
import {PathTransformer} from '../../libs/rest/path-transformer/path-transformer.js';

@injectable()
export class UserController extends ControllerBase {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.UserService) private readonly userService: IUserService,
    @inject(Component.Config) private readonly configService: IConfig<RestSchema>,
    @inject(Component.AuthService) private readonly authService: IAuthService,
    @inject(Component.PathTransformer) protected readonly pathTransformer: PathTransformer,
  ) {
    super(logger, pathTransformer);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create, middlewares: [new ValidateDtoMiddleware(CreateUserDto)] });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login, middlewares: [new ValidateDtoMiddleware(LoginUserDto)] });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.checkAuthenticate,
    });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: LoginUserRequest,
    res: Response,
  ): Promise<void> {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });
    this.ok(res, responseData);
  }

  public async uploadAvatar({file, params}: Request, res: Response) {
    if(!file) {
      throw new HttpError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        'No file selected for upload',
        'UserController',
      );
    }

    const {userId} = params;
    const updateDto = {avatar: file.filename};
    await this.userService.updateById(userId, updateDto);
    this.created(res, file.path);
  }

  public async checkAuthenticate({ tokenPayload: { email }}: Request, res: Response) {
    const foundUser = await this.userService.findByEmail(email);

    if (!foundUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserRdo, foundUser));
  }
}
