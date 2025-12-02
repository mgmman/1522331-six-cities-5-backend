import {
  ControllerBase, DocumentExistsMiddleware, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import {City, Component} from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { IOfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer-rdo.js';
import { ICommentService } from '../comment/index.js';
import {ParamOfferCity, ParamOfferId} from './types/offer-params.js';
import {UpdateOfferDto} from './dto/update-offer-dto.js';
import {CreateOfferRequest} from './types/create-offer-request.type';
import {CreateOfferDto} from './dto/create-offer-dto.js';
import {CommentRdo} from '../comment/rdo/comment-rdo.js';
import {ValidateCityMiddleware} from '../../libs/rest/middleware/validate-city.middleware';

@injectable()
export default class OfferController extends ControllerBase {
  constructor(
    @inject(Component.Logger) protected logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: IOfferService,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavourites });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium, middlewares: [new ValidateCityMiddleware('city')] });
  }

  public async getOffer({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async index(_req: Request, res: Response) {
    const offers = await this.offerService.find();
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, author: '' });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async getFavourites({ headers }: CreateOfferRequest, res: Response) {
    const newOffers = await this.offerService.findFavourites(headers.authorization ?? '');
    this.ok(res, fillDTO(OfferRdo, newOffers));
  }

  public async getPremium({ params }: Request<ParamOfferCity>, res: Response) {
    const newOffers = await this.offerService.findPremiumInCity(params.city as City);
    this.ok(res, fillDTO(OfferRdo, newOffers));
  }
}
