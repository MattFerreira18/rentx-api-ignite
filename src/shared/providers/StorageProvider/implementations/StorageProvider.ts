import { S3 } from 'aws-sdk';
import fs from 'fs';
import mime from 'mime';
import path from 'path';

import upload from '@src/configs/upload';

import { IStorageProvider } from '../IStorageProvider';

export class StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: process.env.AWS_BUCKET_REGION,
    });
  }

  async save(file: string, folder: string): Promise<string> {
    const originalName = path.resolve(upload.tmpFolder, file);
    const fileContent = await fs.promises.readFile(originalName);
    const ContentType = mime.getType(originalName);

    await this.client.putObject({
      Bucket: `${process.env.AWS_BUCKET_NAME}/${folder}`,
      Key: file,
      ACL: 'public-read',
      Body: fileContent,
      ContentType,
    }).promise();

    await fs.promises.unlink(originalName);

    return file;
  }

  async remove(file: string, folder: string): Promise<void> {
    await this.client.deleteObject({
      Bucket: `${process.env.AWS_BUCKET_NAME}/${folder}`,
      Key: file,
    }).promise();
  }
}
