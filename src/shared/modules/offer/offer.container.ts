import {IOfferService} from './offer-service.interface';
import {Component} from '../../types';
import {OfferEntity, OfferModel} from './offer.entity';
import {types} from '@typegoose/typegoose';
import {DefaultOfferService} from './default-offer-service.js';
import {ContainerModule, ContainerModuleLoadOptions} from 'inversify';

export const offerContainer: ContainerModule = new ContainerModule(
  (options: ContainerModuleLoadOptions) => {
    options.bind<IOfferService>(Component.OfferService).to(DefaultOfferService);
    options.bind<types.ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);
  });
