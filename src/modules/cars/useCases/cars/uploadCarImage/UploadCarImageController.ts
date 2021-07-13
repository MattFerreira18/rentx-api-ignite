import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UploadCarImageUseCase } from './UploadCarImageUseCase';

interface IFiles {
  filename: string;
}

export class UploadCarImageController {
  async handle(req: Request, res: Response): Promise<Response> {
    const createCarImageUseCase = container.resolve(UploadCarImageUseCase);

    const { carId } = req.params;
    const images = req.files as IFiles[];

    const fileNames = images.map((file) => file.filename);

    await createCarImageUseCase.execute({ carId, imagesName: fileNames });

    return res.status(201).send();
  }
}
