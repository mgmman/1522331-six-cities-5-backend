import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import {Amenity, City, Coordinates, HousingType} from '../../types/index.js';
import {UserEntity} from '../user/index.js';

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})

export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    type: () => String,
    enum: City
  })
  public city: City;

  @prop({required: true})
  public previewImage: string;

  @prop({required: true})
  public images: [string, string, string, string, string, string];

  @prop({default: false})
  public isPremium: boolean;

  @prop({
    ref: UserEntity,
    required: true,
    default: []
  })
  public favoritedBy!: Ref<UserEntity>[];

  @prop({default: 0})
  public rating: number;

  @prop({required: true})
  public bedrooms: number;

  @prop({required: true})
  public maxGuests: number;

  @prop({default: []})
  public amenities: Amenity[];

  @prop({required: true})
  public coordinates: Coordinates;

  @prop({trim: true, required: true})
  public title!: string;

  @prop({trim: true})
  public description!: string;

  @prop()
  public price!: number;

  @prop({
    type: () => String,
    enum: HousingType
  })
  public type!: HousingType;

  @prop({default: 0})
  public commentCount!: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public author!: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);
