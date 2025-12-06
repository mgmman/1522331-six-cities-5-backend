import {
  ControllerBase, DocumentExistsMiddleware, HttpMethod,
  PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { inject, injectable } from 'inversify';
import {City, Component} from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { IOfferService } from './offer-service.interface.js';
import {fillDTO, fillIsFavorite} from '../../helpers/index.js';
import { OfferRdo } from './rdo/offer-rdo.js';
import { ICommentService } from '../comment/index.js';
import {ParamOfferCity, ParamOfferId} from './types/offer-params.js';
import {UpdateOfferDto} from './dto/update-offer-dto.js';
import {CreateOfferRequest} from './types/create-offer-request.type';
import {CreateOfferDto} from './dto/create-offer-dto.js';
import {ValidateCityMiddleware} from '../../libs/rest/middleware/validate-city.middleware.js';
import { UploadImageRdo } from './rdo/upload-image.rdo.js';
import { IConfig, RestSchema } from '../../libs/config/index.js';
import { UploadFileMiddleware } from '../../libs/rest/middleware/upload-file.middleware.js';
import { UserIsAuthorMiddleware } from '../../libs/rest/middleware/user-is-author.middleware.js';
import {PathTransformer} from '../../libs/rest/path-transformer/path-transformer.js';
import {ShortOfferInfoRdo} from './rdo/short-offer-info-rdo.js';

@injectable()
export default class OfferController extends ControllerBase {
  constructor(
    @inject(Component.Logger) protected logger: ILogger,
    @inject(Component.OfferService) private readonly offerService: IOfferService,
    @inject(Component.CommentService) private readonly commentService: ICommentService,
    @inject(Component.Config) private readonly configService: IConfig<RestSchema>,
    @inject(Component.PathTransformer) protected readonly pathTransformer: PathTransformer,
  ) {
    super(logger, pathTransformer);

    this.logger.info('Register routes for OfferController');
    this.addRoute({ path: '/favorites', method: HttpMethod.Get, handler: this.getFavourites });
    this.addRoute({ path: '/premium/:city', method: HttpMethod.Get, handler: this.getPremium,
      middlewares: [new ValidateCityMiddleware('city')]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.getOffer,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/images',
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'images'),
      ]
    });
    this.addRoute({
      path: '/:offerId/previewImage',
      method: HttpMethod.Post,
      handler: this.uploadPreviewImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'previewImage'),
      ]
    });
    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new UserIsAuthorMiddleware(this.offerService, 'offerId', 'author')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new UserIsAuthorMiddleware(this.offerService, 'offerId', 'author')
      ]
    });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Patch, handler: this.addOrDeleteFavourite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async getOffer({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    this.ok(res, fillDTO(OfferRdo, fillIsFavorite(offer, tokenPayload?.id)));
  }

  public async index({query, tokenPayload}: Request, res: Response) {
    const count = query.count ? Number(query.count) : undefined;
    const offers = await this.offerService.find(count);
    this.ok(res, fillDTO(ShortOfferInfoRdo, offers.map((x) => fillIsFavorite(x, tokenPayload?.id))));
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, author: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update({ body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, fillIsFavorite(updatedOffer, tokenPayload?.id)));
  }

  public async getFavourites({ tokenPayload }: CreateOfferRequest, res: Response) {
    const newOffers = await this.offerService.findFavourites(tokenPayload.id);
    this.ok(res, fillDTO(OfferRdo, newOffers.map((x) => fillIsFavorite(x, tokenPayload?.id))));
  }

  public async getPremium({ params, query, tokenPayload }: Request<ParamOfferCity>, res: Response) {
    const count = query.count ? Number(query.count) : undefined;
    const newOffers = await this.offerService.findPremiumInCity(params.city as City, count);
    this.ok(res, fillDTO(OfferRdo, newOffers.map((x) => fillIsFavorite(x, tokenPayload?.id))));
  }

  public async uploadPreviewImage({ params, file } : Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const updateDto = { previewImage: file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }

  public async uploadImages({ params, files } : Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const updateDto = { images: files as unknown as [string, string, string, string, string, string] };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageRdo, updateDto));
  }

  public async addOrDeleteFavourite({ tokenPayload, params }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;
    const newOffer = await this.offerService.addOrRemoveFavourite(offerId, tokenPayload.id);
    const dto = fillDTO(OfferRdo, fillIsFavorite(newOffer, tokenPayload.id));
    this.ok(res, dto);
  }
}
