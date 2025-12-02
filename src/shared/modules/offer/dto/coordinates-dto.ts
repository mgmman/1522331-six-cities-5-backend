import {offerValidations} from './offer-validations.js';
import {IsNumber} from 'class-validator';

export class CoordinatesDto {
  @IsNumber(offerValidations.coordinates.latitude.invalidFormat)
  public latitude: number;

  @IsNumber(offerValidations.coordinates.latitude.invalidFormat)
  public longitude: number;
}
