import { ParamsDictionary } from 'express-serve-static-core';
import {City} from '../../../types';

export type ParamOfferId = {
  offerId: string;
} | ParamsDictionary;

export type ParamOfferCity = {
  city: City;
} | ParamsDictionary;
