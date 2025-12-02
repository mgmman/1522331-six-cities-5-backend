import { Request } from 'express';
import {RequestBody, RequestParams} from '../../../libs/rest/types/request.type';
import {CreateUserDto} from '../dto/create-user-dto.js';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
