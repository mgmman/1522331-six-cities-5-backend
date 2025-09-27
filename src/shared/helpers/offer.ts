import {AMENITIES, Amenity, City, HousingType, isMemberOfUnion, Offer} from '../types/index.js';

export function parseOffer(data: string): Offer {
  const [
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
    latitude,
    longitude] = data.replace('\n', '')
    .split('\t');

  return {
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
    amenities: amenities.trim().split(';').map((x) => isMemberOfUnion(x, AMENITIES) ? x : undefined).filter((x) => !!x) as Amenity[],
    authorId,
    commentCount: 0,
    coordinates: {latitude: parseFloat(latitude), longitude: parseFloat(longitude)},
  };
}
