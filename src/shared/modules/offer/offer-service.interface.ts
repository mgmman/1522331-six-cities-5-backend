import { CreateOfferDto } from './dto/create-offer-dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { City } from '../../types/city.enum.js';
import {IDocumentExists} from '../../types';
import { ICheckUserIsAuthor } from '../../types/check-user-is-author.service.js';
import { OfferUpdate } from './types/offer-update.js';

export interface IOfferService extends IDocumentExists, ICheckUserIsAuthor {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: OfferUpdate): Promise<DocumentType<OfferEntity> | null>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumInCity(city: City): Promise<DocumentType<OfferEntity>[]>;
  findFavourites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addToFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteFromFavourites(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
  recalculateRating(offerId: string): Promise<void>;
}
