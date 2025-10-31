export const offerValidations = {
  title: {
    invalidFormat: 'title is required',
    length: 'Minimum title length must be between 10 and 100',
  },
  description: {
    invalidFormat: 'description is required',
    length: 'description length must be between 20 and 1024',
  },
  city: {
    invalidFormat: 'city is required and must be one of: Paris, Cologne, Brussels, Amsterdam, Hamburg or Dusseldorf',
  },
  image: {
    invalidFormat: 'image is required',
  },
  type: {
    invalidFormat: 'type must be one of: apartment, house, room or hotel',
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 200000',
  },
  isPremium: {
    invalidFormat: 'isPremium must be a bool or not defined',
  },
  author: {
    invalidId: 'userId field must be a valid id',
  },
  maxGuests: {
    invalidFormat: 'maxGuests is required',
    range: 'maxGuests must be between 1 and 10',
  },
  bedroomsCount: {
    invalidFormat: 'bedrooms is required',
    range: 'bedrooms must be between 1 and 8',
  },
  coordinates: {
    invalidFormat: {
      message: 'Coordinates must be object',
    },
    latitude: {
      invalidFormat: {
        message: 'Latitude must be number'
      },
    },
    longitude: {
      invalidFormat: {
        message: 'Longitude must be number',
      },
    },
  }
} as const;
