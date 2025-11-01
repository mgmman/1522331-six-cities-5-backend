import { ICommand } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { parseOffer, getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { IUserService } from '../../shared/modules/user/user-service.interface.js';
import { DefaultOfferService, OfferModel, IOfferService } from '../../shared/modules/offer/index.js';
import { IDatabaseClient, MongoClient } from '../../shared/libs/db-client/index.js';
import { ConsoleLogger, ILogger } from '../../shared/libs/logger/index.js';
import { DefaultUserService, UserModel } from '../../shared/modules/user/index.js';
import { Offer } from '../../shared/types/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from '../../shared/constants/index.js';

export class ImportCommand implements ICommand {
  private userService: IUserService;
  private offerService: IOfferService;
  private databaseClient: IDatabaseClient;
  private logger: ILogger;
  private salt: string;

  constructor() {
    this.onImportedLine = this.onImportedLine.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoClient(this.logger);
  }

  private async onImportedLine(line: string, resolve: () => void) {
    const offer = parseOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);
    this.databaseClient.disconnect();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      title: offer.title,
      description: offer.description,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxGuests: offer.maxGuests,
      price: offer.price,
      amenities: offer.amenities,
      author: user.id,
      coordinates: offer.coordinates,
    });
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedLine);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
