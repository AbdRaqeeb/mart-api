import { v2 as cloudinary } from 'cloudinary';
import { createWriteStream, unlinkSync, ReadStream } from 'fs';
import { InternalServerErrorException } from '@nestjs/common';

export const uploadImage = async (
  filename: string,
  readStream: ReadStream,
  folder: string,
): Promise<string> => {
  let filePath: string;

  const state = await new Promise(async (resolve, reject) =>
    readStream
      .pipe(createWriteStream(`${__dirname}/src/common/uploads/${filename}`))
      .on('finish', () => resolve(true))
      .on('error', () => reject(false)),
  );

  try {
    if (state) {
      filePath = `${__dirname}/src/common/uploads/${filename}`;
    }

    if (!state) {
      unlinkSync(`${__dirname}/src/common/uploads/${filename}`);
    }

    const result = await cloudinary.uploader.upload(
      filePath,
      {
        folder,
      },
      () => unlinkSync(`${__dirname}/src/common/uploads/${filename}`),
    );

    // delete after upload
    unlinkSync(`${__dirname}/src/common/uploads/${filename}`);

    return result.secure_url;
  } catch (e) {
    throw new InternalServerErrorException(e);
  }
};
