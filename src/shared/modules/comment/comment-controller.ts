import { inject, injectable } from 'inversify';
import {Request, Response} from 'express';
import {
  ControllerBase,
  DocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware, ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { ICommentService } from './comment-service.interface.js';
import { IOfferService } from '../offer/index.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo } from './rdo/comment-rdo.js';
import { CreateCommentRequest } from './types/create-comment-request.type.js';
import {PathTransformer} from '../../libs/rest/path-transformer/path-transformer.js';
import {ParamOfferId} from '../offer/types/offer-params.js';
import {CreateCommentRequestDto} from './dto/create-comment-request-dto.js';

@injectable()
export default class CommentController extends ControllerBase {
  constructor(
    @inject(Component.Logger) protected readonly logger: ILogger,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
    @inject(Component.OfferService) private readonly offerService: IOfferService,
    @inject(Component.PathTransformer) protected readonly pathTransformer: PathTransformer,
  ) {
    super(logger, pathTransformer);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentRequestDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
  }

  public async create(
    { body, tokenPayload, params }: CreateCommentRequest,
    res: Response
  ): Promise<void> {
    const comment = await this.commentService.create({ ...body, offerId: params.offerId, author: tokenPayload.id });
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async getComments({ params, query }: Request<ParamOfferId>, res: Response): Promise<void> {
    const count = query.count ? Number(query.count) : undefined;
    const comments = await this.commentService.findByOfferId(params.offerId, count);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
