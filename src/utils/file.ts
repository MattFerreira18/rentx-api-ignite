import fs from 'fs';

export const deleteFile = async (filename: string): Promise<void> => {
  try {
    await fs.promises.stat(filename); // verify if file exists
  } catch {
    return;
  }

  await fs.promises.unlink(filename); // remove file
};
