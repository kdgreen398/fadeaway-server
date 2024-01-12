import { Storage } from "@google-cloud/storage";
import path from "path";
import sharp from "sharp";

const storage = new Storage();
const bucket = storage.bucket(process.env.CLOUD_IMAGE_STORAGE_BUCKET || "");

async function processImage(imageBuffer: Buffer) {
  return sharp(imageBuffer)
    .jpeg({ quality: 60 }) // Set the desired quality (0-100)
    .toBuffer();
}

export async function uploadBarberProfileImage(
  uploadedFile: Express.Multer.File,
) {
  const originalNameWithoutExtension = path.parse(
    uploadedFile.originalname,
  ).name;
  const fileName = Date.now() + "_" + originalNameWithoutExtension + ".jpg";
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
