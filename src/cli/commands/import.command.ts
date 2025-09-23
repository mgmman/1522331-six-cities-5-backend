import { ICommand } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import chalk from 'chalk';

export class ImportCommand implements ICommand {
  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();
      console.log(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      console.error(chalk.red(`Can't import data from file: ${chalk.yellow(filename)}`));
      console.error(chalk.red(`Details: ${chalk.redBright(err.message)}`));
    }
  }
}
