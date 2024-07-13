import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();
const secrets = [
  "DB_USER",
  "DB_PASSWORD",
  "DB_PORT",
  "INSTANCE_UNIX_SOCKET",
  "CLOUD_IMAGE_STORAGE_BUCKET",
  "GOOGLE_MAPS_API_KEY",
  "FIREBASE_ADMIN_KEY",
];

export async function fetchSecrets() {
  const obj: { [x: string]: string } = {};
  const promises = secrets.map(async (secret) => {
    const [version] = await client.accessSecretVersion({
      name: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/secrets/${secret}/versions/latest`,
    });
    if (!version.payload || !version.payload.data) {
      throw new Error(`Error fetching secret ${secret}`);
    }

    const value = version.payload.data.toString();
    obj[secret] = value;
    process.env[secret] = value;
  });

  await Promise.all(promises);
  return obj;
}
