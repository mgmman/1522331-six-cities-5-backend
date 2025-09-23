import { IFileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { City, Offer, HousingType, isMemberOfUnion, AMENITIES, Amenity } from '../../types/index.js';

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
      .map(([title, description, publicationDate, city, previewImage, image1, image2, image3, image4, image5, image6, isPremium, isFavorite, rating, type, bedrooms, maxGuests, price, amenities, authorId, latitude, longitude]) => ({
        title,
        description,
        publicationDate: new Date(publicationDate),
        city: City[city as keyof typeof City],
        previewImage,
        images: [image1, image2, image3, image4, image5, image6],
        isPremium: isPremium === 'true',
        isFavorite: isFavorite === 'true',
        rating: parseFloat(rating),
        type: HousingType[type as keyof typeof HousingType],
        bedrooms: parseInt(bedrooms, 10),
        maxGuests: parseInt(maxGuests, 10),
        price: parseInt(price, 10),
        amenities: amenities.trim()
                            .split(';')
                            .map((x) => isMemberOfUnion(x, AMENITIES) ? x : undefined)
                            .filter((x) => !!x) as Amenity[],
        authorId,
        commentCount: 0,
        coordinates: {latitude: parseFloat(latitude), longitude: parseFloat(longitude)},
      }));
  }
}
