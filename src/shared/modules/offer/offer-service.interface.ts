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
  find(limit?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: OfferUpdate): Promise<DocumentType<OfferEntity> | null>;
  findPremiumInCity(city: City, limit?: number): Promise<DocumentType<OfferEntity>[]>;
  findFavourites(userId: string): Promise<DocumentType<OfferEntity>[]>;
  addOrRemoveFavourite(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(documentId: string): Promise<boolean>;
}
