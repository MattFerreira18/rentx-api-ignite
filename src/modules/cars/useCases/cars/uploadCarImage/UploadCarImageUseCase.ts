import { inject, injectable } from 'tsyringe';

import { IStorageProvider } from '@providers/StorageProvider/IStorageProvider';

import { CarImage } from '../../../infra/database/entities/CarImage';
import { ICarsImagesRepository } from '../../../repositories/ICarsImagesRepository';

interface IRequest {
  carId: string;
  imagesName: string[];
}

@injectable()
export class UploadCarImageUseCase {
  constructor(
    @inject('CarsImagesRepository')
    private carsImagesRepository: ICarsImagesRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  async execute({ carId, imagesName }: IRequest): Promise<CarImage[]> {
    const carImages: CarImage[] = [];

    imagesName.map(async (img) => {
      const carImg = await this.carsImagesRepository.create(carId, img);
      await this.storageProvider.save(img, 'cars');

      carImages.push(carImg);
    });

    return carImages;
  }
}
