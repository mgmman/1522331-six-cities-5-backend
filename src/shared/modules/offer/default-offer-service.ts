import { inject, injectable } from 'inversify';
import { IOfferService } from './offer-service.interface.js';
import { City, Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer-dto.js';
import { OfferUpdate } from './types/offer-update.js';
import {IUserService} from '../user';
import {DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER_COUNT} from '../../constants/index.js';

@injectable()
export class DefaultOfferService implements IOfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: ILogger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserService) private readonly userService: IUserService,
  ) {
  }

  public async checkUserIsAuthor(entityId: string, userId: string): Promise<boolean> {
    const offer = await this.findById(entityId);
    return offer?.author._id.toString() === userId;
  }

  public async find(limit?: number): Promise<DocumentType<OfferEntity>[]> {
    limit ??= DEFAULT_OFFER_COUNT;
    //@ts-ignore
    return this.offerModel
      .find()
      .limit(limit)
      .sort('-createdAt')
      .populate(['author'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async updateById(offerId: string, dto: OfferUpdate): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['author'])
      .exec();
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({...dto, rating: 0});
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['author']).exec();
  }

  public async findPremiumInCity(city: City, limit?: number): Promise<DocumentType<OfferEntity>[]> {
    limit ??= DEFAULT_PREMIUM_OFFER_COUNT;
    return this.offerModel.find({city, isPremium: true})
      .limit(limit)
      .sort('-createdAt')
      .populate(['author'])
      .exec();
  }

  public async findFavourites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({favoritedBy: userId}).populate(['author']).exec();
  }

  public async addOrRemoveFavourite(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer: OfferEntity | null = await this.offerModel.findById(offerId).populate(['author']).exec();
    if (!offer) {
      return null;
    }
    const userIndex = offer.favoritedBy.findIndex((x) => x._id.toString() === userId);
    if (userIndex !== -1) {
      offer.favoritedBy.splice(userIndex, 1);
    } else {
      const user = await this.userService.findById(userId);
      if (!user) {
        return null;
      }
      offer.favoritedBy.push(user.id);
    }
    return this.offerModel.findByIdAndUpdate(offerId, offer, {new: true}).exec();
  }
}
