import csvParse from 'csv-parse';
import fs from 'fs';
import { inject, injectable } from 'tsyringe';

import { ICreateCategoryDTO } from '../../../dtos/ICategoryDTO';
import { ICategoriesRepository } from '../../../repositories/ICategoriesRepository';

@injectable()
class ImportCategoryUseCase {
  constructor(
    @inject('CategoriesRepository')
    private categoriesRepository: ICategoriesRepository,
  ) {}

  // convert CSV in a array of objects
  private async loadCategories(
    file: Express.Multer.File,
  ): Promise<ICreateCategoryDTO[]> {
    return new Promise((resolve, reject) => {
      const stream = fs.createReadStream(file.path);
      const parseFile = csvParse();
      const categories: ICreateCategoryDTO[] = [];

      stream.pipe(parseFile);

      parseFile.on('data', async (line) => {
        const [name, description] = line;

        categories.push({ name, description });
      });

      parseFile.on('end', () => {
        fs.promises.unlink(file.path); // delete archive
        resolve(categories);
      });

      parseFile.on('error', (err) => {
        reject(err);
      });

      return categories;
    });
  }

  async execute(file: Express.Multer.File): Promise<void> {
    const categories = await this.loadCategories(file);

    categories.map(async (category) => {
      const { name, description } = category;

      const categoryAlreadyExists = await this.categoriesRepository.findByName(
        name,
      );

      if (!categoryAlreadyExists) {
        this.categoriesRepository.create({ name, description });
      }
    });
  }
}

export { ImportCategoryUseCase };
