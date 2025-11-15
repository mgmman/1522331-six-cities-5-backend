import { UpdateOfferDto } from "../dto/update-offer-dto";

export class OfferUpdate extends UpdateOfferDto {
  rating?: number;
  commentCount?: number;
}
