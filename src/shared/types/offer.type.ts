import {City} from './city.enum';
import {HousingType} from './housing-type.enum';
import {Amenity} from './amenity.enum';
import {Coordinates} from './coordinates.type';

export type Offer = {
  title: string;
  description: string;
  publicationDate: Date;
  city: City;
  previewImage: string;
  images: [string, string, string, string, string, string];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  bedrooms: number;
  maxGuests: number;
  price: number;
  amenities: Amenity[];
  author: string;
  commentCount: number;
  coordinates: Coordinates;
}
