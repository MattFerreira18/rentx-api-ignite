import { CarImage } from '../../infra/database/entities/CarImage';
import { ICarsImagesRepository } from '../ICarsImagesRepository';

export class CarsImagesRepositoryInMemory implements ICarsImagesRepository {
  private repository: CarImage[] = [];

  async create(carId: string, imageName: string): Promise<CarImage> {
    const carImage = new CarImage();

    Object.assign(carImage, { carId, imageName });

    this.repository.push(carImage);

    return carImage;
  }
}
