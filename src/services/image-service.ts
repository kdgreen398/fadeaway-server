import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { BarberImage } from "../entities/barber-image";
import { AppDataSource } from "../util/data-source";

const storage = new Storage();
const bucket = storage.bucket(process.env.CLOUD_IMAGE_STORAGE_BUCKET || "");

async function processImage(imageBuffer: Buffer) {
  return sharp(imageBuffer)
    .jpeg({ quality: 60 }) // Set the desired quality (0-100)
    .toBuffer();
}

export async function uploadBarberProfileImage(
  uploadedFile: Express.Multer.File,
  barberId: number,
) {
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

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

export async function uploadBarberImage(
  uploadedFile: Express.Multer.File,
  barberId: number,
) {
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

  const image = BarberImage.create({
    fileName,
    url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
    barber: { id: barberId },
  });

  await AppDataSource.manager.save(image);

  return image.url;
}

export async function deleteBarberImage(
  barberId: number,
  imageToDelete: BarberImage,
) {
  const image = await AppDataSource.manager.findOne(BarberImage, {
    where: {
      fileName: imageToDelete.fileName,
      barber: {
        id: barberId,
      },
    },
  });

  if (!image) {
    throw new Error("Image not found");
  }

  await bucket.file(image.fileName).delete();

  await AppDataSource.manager.delete(BarberImage, image);

  return "image deleted successfully";
}
