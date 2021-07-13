import { inject, injectable } from 'tsyringe';

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
  ) {}

  async execute({ carId, imagesName }: IRequest): Promise<CarImage[]> {
    const carImages: CarImage[] = [];

    imagesName.map(async (img) => {
      const carImg = await this.carsImagesRepository.create(carId, img);

      carImages.push(carImg);
    });

    return carImages;
  }
}
