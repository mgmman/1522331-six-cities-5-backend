import { IFileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import {City, Offer, HousingType, Amenity, Coordinates} from '../../types/index.js';

export class TSVFileReader implements IFileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([title, description, publicationDate, city, previewImage, images, isPremium, isFavorite, rating, type, bedrooms, maxGuests, price, amenities, authorId, coordinates]) => ({
        title,
        description,
        publicationDate: new Date(publicationDate),
        city: City[city as keyof City],
        previewImage,
        images: images.trim().split(';'),
        isPremium,
        isFavorite,
        rating,
        type: HousingType[type as keyof HousingType],
        bedrooms,
        maxGuests,
        price: Number.parseInt(price, 10),
        amenities,
        authorId,
        commentCount,
        coordinates,
      }));
  }
}
