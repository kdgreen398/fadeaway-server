import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { Image } from "../entities/image";
import { Provider } from "../entities/provider";
import { Service } from "../entities/service";
import { ImageTypeEnum } from "../enums/image-type-enum";
import { AppDataSource } from "../util/data-source";

const storage = new Storage();
const bucket = storage.bucket(process.env.CLOUD_IMAGE_STORAGE_BUCKET || "");

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

    stream.on("error", (err) => {
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

export async function deleteImage(providerId: number, imageToDelete: Image) {
  const image = await AppDataSource.manager.findOne(Image, {
    where: {
      fileName: imageToDelete.fileName,
      provider: {
        id: providerId,
      },
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  await bucket.file(image.fileName).delete();

  await AppDataSource.manager.delete(Image, image);

  return "image deleted successfully";
}
