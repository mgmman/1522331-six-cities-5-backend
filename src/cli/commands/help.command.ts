import chalk from 'chalk';
import { ICommand } from './command.interface.js';

export class HelpCommand implements ICommand {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(chalk.yellow(`
        Программа для подготовки данных для REST API сервера.

        Пример: cli.js --<command> [--arguments]

        Команды:

         --version:                   # выводит номер версии
         --help:                      # печатает этот текст
         --import <path>:             # импортирует данные из TSV. Параметр path указывает путь до файла
         --generate <n> <path> <url>  # генерирует произвольное количество тестовых данных. Параметр n задаёт количество генерируемых предложений.
         Параметр path указывает путь для сохранения файла с предложениями. Параметр url задаёт адрес сервера, с которого необходимо взять данные
    `));
  }
}
