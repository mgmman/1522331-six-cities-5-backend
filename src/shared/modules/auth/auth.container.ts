import {ContainerModule, ContainerModuleLoadOptions} from 'inversify';
import {Component} from '../../types/index.js';
import {IExceptionFilter} from '../../libs/rest/index.js';
import {DefaultAuthService} from './default-auth.service.js';
import {AuthExceptionFilter} from './auth.exception-filter.js';
import {IAuthService} from './auth-service.interface.js';

export const authContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<IAuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
    options.bind<IExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();
  });
