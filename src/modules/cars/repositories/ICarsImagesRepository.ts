import { CarImage } from '../infra/database/entities/CarImage';

export interface ICarsImagesRepository {
  create(id: string, imageName: string): Promise<CarImage>;
}
