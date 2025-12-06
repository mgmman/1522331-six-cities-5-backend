import { Request } from 'express';
import { RequestBody, } from '../../../libs/rest/index.js';
import {CreateCommentRequestDto} from '../dto/create-comment-request-dto.js';
import {ParamOfferId} from '../../offer/types/offer-params.js';

export type CreateCommentRequest = Request<ParamOfferId, RequestBody, CreateCommentRequestDto>;
