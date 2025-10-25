import {Amenity, HousingType} from '../../../types';

export class UpdateOfferDto {
  title: string;
  description: string;
  previewImage: string;
  images: [string, string, string, string, string, string];
  isPremium?: boolean;
  isFavorite?: boolean;
  type: HousingType;
  bedrooms: number;
  maxGuests: number;
  price: number;
  amenities: Amenity[];
}
