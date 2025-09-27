import dayjs from 'dayjs';
import { IOfferGenerator } from './offer-generator.interface.js';
import {AMENITIES, City, HousingType, MockServerData} from '../../types/index.js';
import {
  generateRandomBoolean,
  generateRandomValue,
  getRandomItem,
  getRandomItems,
  getRandomNItems
} from '../../helpers/index.js';
import {
  MAX_BEDROOMS,
  MAX_GUESTS,
  MAX_PRICE,
  MAX_RATING,
  MIN_BEDROOMS, MIN_GUESTS,
  MIN_PRICE,
  MIN_RATING,
} from '../../constants/index.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements IOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const [image1, image2, image3, image4, image5, image6] = getRandomNItems(this.mockData.images, 6);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const authorId = generateRandomValue(1, 10000);
    const city = getRandomItem<string>(Object.keys(City));
    const isPremium = generateRandomBoolean();
    const isFavorite = generateRandomBoolean();
    const rating = generateRandomValue(MIN_RATING, MAX_RATING);
    const type = getRandomItem<string>(Object.keys(HousingType));
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS);
    const maxGuests = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const amenities = getRandomItems<string>(AMENITIES as unknown as string[]).join(';');
    const coordinates = getRandomItem(this.mockData.locations);

    const publicationDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title,
      description,
      publicationDate,
      city,
      previewImage,
      image1,
      image2,
      image3,
      image4,
      image5,
      image6,
      isPremium,
      isFavorite,
      rating,
      type,
      bedrooms,
      maxGuests,
      price,
      amenities,
      authorId,
      coordinates.latitude,
      coordinates.longitude
    ].join('\t');
  }
}
