import {ContainerModule, ContainerModuleLoadOptions} from 'inversify/lib/esm';
import {Component} from '../../types';
import {IExceptionFilter} from '../../libs/rest';
import {DefaultAuthService} from './default-auth.service';
import {AuthExceptionFilter} from './auth.exception-filter';
import {IAuthService} from './auth-service.interface';

export const authContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<IAuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
    options.bind<IExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();
  });
