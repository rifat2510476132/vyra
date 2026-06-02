import { v2 as cloudinary } from 'cloudinary';

import { env } from '../config/env';



let configured = false;



export function initCloudinary(): void {

  if (configured || !env.cloudinary.cloudName) return;

  cloudinary.config({

    cloud_name: env.cloudinary.cloudName,

    api_key: env.cloudinary.apiKey,

    api_secret: env.cloudinary.apiSecret,

  });

  configured = true;

}



export async function uploadToCloudinary(

  filePath: string,

  folder = 'vyra'

): Promise<{ url: string; publicId: string }> {

  initCloudinary();

  const result = await cloudinary.uploader.upload(filePath, { folder });

  return { url: result.secure_url, publicId: result.public_id };

}



export async function uploadBufferToCloudinary(

  buffer: Buffer,

  options: {

    folder?: string;

    resourceType?: 'image' | 'video' | 'auto';

    mimeType?: string;

  } = {}

): Promise<{ url: string; publicId: string; width?: number; height?: number }> {

  initCloudinary();

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(

      {

        folder: options.folder ?? 'vyra',

        resource_type: options.resourceType ?? 'auto',

      },

      (err, result) => {

        if (err || !result) {

          reject(err ?? new Error('Cloudinary upload failed'));

          return;

        }

        resolve({

          url: result.secure_url,

          publicId: result.public_id,

          width: result.width,

          height: result.height,

        });

      }

    );

    stream.end(buffer);

  });

}



export async function deleteFromCloudinary(publicId: string): Promise<void> {

  initCloudinary();

  await cloudinary.uploader.destroy(publicId);

}



export { cloudinary };


