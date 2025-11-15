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
  Min,
  ValidateNested
} from 'class-validator';
import {offerValidations} from './offer-validations.js';
import {Type} from 'class-transformer';
import {CoordinatesDto} from './coordinates-dto.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: offerValidations.title.invalidFormat })
  @Length(10, 100, { message: offerValidations.title.length })
  public title?: string;

  @IsOptional()
  @IsString({ message: offerValidations.description.invalidFormat })
  @Length(20, 1024, { message: offerValidations.description.length })
  public description?: string;

  @IsOptional()
  @IsEnum(City, {message: offerValidations.city.invalidFormat })
  public city?: City;

  @IsOptional()
  @IsString({ message: offerValidations.image.invalidFormat })
  public previewImage?: string;

  @IsOptional()
  @IsString({ each: true, message: offerValidations.image.invalidFormat })
  @Length(1, 6, {message: offerValidations.image.invalidFormat})
  public images?: [string, string, string, string, string, string];

  @IsOptional()
  @IsBoolean({ message: offerValidations.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(HousingType, { message: offerValidations.type.invalidFormat })
  public type?: HousingType;

  @IsOptional()
  @IsInt({ message: offerValidations.bedroomsCount.invalidFormat })
  @Min(1, { message: offerValidations.bedroomsCount.range })
  @Max(8, { message: offerValidations.bedroomsCount.range })
  public bedrooms?: number;

  @IsOptional()
  @IsInt({ message: offerValidations.maxGuests.invalidFormat })
  @Min(1, { message: offerValidations.maxGuests.range })
  @Max(10, { message: offerValidations.maxGuests.range })
  public maxGuests?: number;

  @IsOptional()
  @IsInt({ message: offerValidations.price.invalidFormat })
  @Min(100, { message: offerValidations.price.minValue })
  @Max(100_000, { message: offerValidations.price.maxValue })
  public price?: number;

  @IsOptional()
  @IsString({ each: true, message: offerValidations.price.invalidFormat })
  public amenities?: Amenity[];

  @IsOptional()
  @IsObject({ message: offerValidations.coordinates.invalidFormat})
  @ValidateNested()
  @Type(() => CoordinatesDto)
  public coordinates?: CoordinatesDto;
}
