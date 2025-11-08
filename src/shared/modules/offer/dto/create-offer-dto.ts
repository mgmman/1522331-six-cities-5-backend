import {Amenity, City, HousingType} from '../../../types/index.js';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Max,
  Min, ValidateNested
} from 'class-validator';
import {offerValidations} from './offer-validations.js';
import {Type} from 'class-transformer';
import {CoordinatesDto} from './coordinates-dto.js';

export class CreateOfferDto {
  @IsString({ message: offerValidations.title.invalidFormat })
  @Length(10, 100, { message: offerValidations.title.length })
  public title: string;

  @IsString({ message: offerValidations.description.invalidFormat })
  @Length(20, 1024, { message: offerValidations.description.length })
  public description: string;

  @IsEnum(City, {message: offerValidations.city.invalidFormat })
  public city: City;

  @IsString({ message: offerValidations.image.invalidFormat })
  public previewImage: string;

  @IsString({ each: true, message: offerValidations.image.invalidFormat })
  public images: [string, string, string, string, string, string];

  @IsOptional()
  @IsBoolean({ message: offerValidations.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsEnum(HousingType, { message: offerValidations.type.invalidFormat })
  public type: HousingType;

  @IsInt({ message: offerValidations.bedroomsCount.invalidFormat })
  @Min(1, { message: offerValidations.bedroomsCount.range })
  @Max(8, { message: offerValidations.bedroomsCount.range })
  public bedrooms: number;

  @IsInt({ message: offerValidations.maxGuests.invalidFormat })
  @Min(1, { message: offerValidations.maxGuests.range })
  @Max(10, { message: offerValidations.maxGuests.range })
  public maxGuests: number;

  @IsInt({ message: offerValidations.price.invalidFormat })
  @Min(100, { message: offerValidations.price.minValue })
  @Max(100_000, { message: offerValidations.price.maxValue })
  public price: number;

  @IsString({ each: true, message: offerValidations.price.invalidFormat })
  public amenities: Amenity[];

  public author: string;

  @IsObject({ message: offerValidations.coordinates.invalidFormat})
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates: CoordinatesDto;
}
