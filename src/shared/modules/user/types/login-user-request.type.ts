import { Request } from 'express';
import {RequestBody, RequestParams} from '../../../libs/rest';
import {LoginUserDto} from '../dto/login-user-dto.js';

export type LoginUserRequest = Request<RequestParams, RequestBody, LoginUserDto>;
