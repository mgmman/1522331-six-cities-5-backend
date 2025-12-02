import {offerValidations} from './offer-validations.js';
import {IsNumber} from 'class-validator';

export class CoordinatesDto {
  @IsNumber({}, {message: offerValidations.coordinates.latitude.invalidFormat})
  public latitude: number;

  @IsNumber({}, {message: offerValidations.coordinates.longitude.invalidFormat})
  public longitude: number;
}
