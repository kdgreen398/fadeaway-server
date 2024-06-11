import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { Image } from "../entities/image";
import { Provider } from "../entities/provider";
import { Service } from "../entities/service";
import { ImageTypeEnum } from "../enums/image-type-enum";
import { AppDataSource } from "../util/data-source";
import logger from "../util/logger";

const storage = new Storage();

async function processImage(imageBuffer: Buffer) {
  return sharp(imageBuffer)
    .jpeg({ quality: 60 }) // Set the desired quality (0-100)
    .toBuffer();
}

export async function uploadImage(
  uploadedFile: Express.Multer.File,
  imageType: ImageTypeEnum,
  providerId: number,
  serviceId: number | null,
) {
  logger.info("image-service => uploadImage");
  // check if provider exists
  const provider = await AppDataSource.manager.findOne(Provider, {
    where: { id: providerId },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  // check if service belongs to provider
  const service = serviceId
    ? await AppDataSource.manager.findOne(Service, {
        where: { id: serviceId, provider: { id: providerId } },
      })
    : null;

  if (serviceId && !service) {
    throw new Error("Service not found");
  }

  const fileName = Date.now() + ".jpg";

  const bucket = storage.bucket(
    process.env.CLOUD_IMAGE_STORAGE_BUCKET as string,
  );

  const stream = bucket.file(fileName).createWriteStream({
    metadata: {
      contentType: "image/jpeg",
    },
  });

  const imageBuffer = await processImage(uploadedFile.buffer);

  await new Promise((resolve, reject) => {
    stream.end(imageBuffer);

    stream.on("finish", () => {
      // File uploaded successfully
      resolve(true);
    });

    stream.on("error", () => {
      reject(false);
    });
  });

  const image = Image.create({
    fileName,
    url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
    imageType,
    service,
    provider,
  });

  await AppDataSource.manager.save(image);

  return image;
}

export async function deleteImage(
  providerId: number,
  imageId: number,
  fileName: string,
) {
  logger.info("image-service => deleteImage");
  const image = await AppDataSource.manager.findOne(Image, {
    where: {
      id: imageId,
      fileName,
      provider: {
        id: providerId,
      },
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  const bucket = storage.bucket(
    process.env.CLOUD_IMAGE_STORAGE_BUCKET as string,
  );
  await bucket.file(image.fileName).delete();

  await AppDataSource.manager.delete(Image, image);

  return "image deleted successfully";
}

export async function updateImageService(
  providerId: number,
  serviceId: number,
  imageId: number,
) {
  logger.info("image-service => updateImageService");
  const provider = await AppDataSource.manager.findOne(Provider, {
    where: { id: providerId },
  });

  if (!provider) {
    throw new Error("Provider not found");
  }

  const service = await AppDataSource.manager.findOne(Service, {
    where: { id: serviceId, provider: { id: providerId } },
  });

  if (!service) {
    throw new Error("Service not found");
  }

  const imageToUpdate = await AppDataSource.manager.findOne(Image, {
    where: { id: imageId, provider: { id: providerId } },
  });

  if (!imageToUpdate) {
    throw new Error("Image not found");
  }

  imageToUpdate.service = service;

  await AppDataSource.manager.save(imageToUpdate);

  return imageToUpdate;
}
