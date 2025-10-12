import {Amenity, City, Coordinates, HousingType} from '../../../types';

export class CreateOfferDto {
  title: string;
  description: string;
  city: City;
  previewImage: string;
  images: [string, string, string, string, string, string];
  isPremium?: boolean;
  isFavorite?: boolean;
  rating?: number;
  type: HousingType;
  bedrooms: number;
  maxGuests: number;
  price: number;
  amenities: Amenity[];
  authorId: string;
  coordinates: Coordinates;
}
