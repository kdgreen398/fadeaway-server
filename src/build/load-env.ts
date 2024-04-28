import * as dotenv from "dotenv";
dotenv.config(); // Loads environment variables from .env file into process.env

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

async function fetchSecret(secretName: string, envName: string) {
  const client = new SecretManagerServiceClient();

  const [version] = await client.accessSecretVersion({
    name: secretName,
  });

  const secretValue = version.payload?.data?.toString();
  process.env[envName] = secretValue;
}

async function main() {
  if (process.env.NODE_ENV !== "production") {
    console.log("environment is not production, skipping secret fetching.");
    return;
  }

  const secrets = [
    "DB_USER",
    "DB_PASSWORD",
    "INSTANCE_UNIX_SOCKET",
    "GOOGLE_MAPS_API_KEY",
    "CLOUD_IMAGE_STORAGE_BUCKET",
    "JWT_SECRET_KEY",
  ];

  const startTime = Date.now();
  const promises = secrets.map((secret) =>
    fetchSecret(
      `projects/${process.env.PROJECT_ID}/secrets/${secret}/versions/latest`,
      secret,
    ),
  );
  await Promise.all(promises);

  const endTime = Date.now();
  console.log("Secrets fetched in", endTime - startTime, "ms");
}

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1); // Exit with error code
});
