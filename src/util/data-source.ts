import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import logger from "./logger";
import { fetchSecrets } from "./secret-manager";

const isProduction = process.env.NODE_ENV === "production";

const getDataSourceOptions: () => DataSourceOptions = () => ({
  type: "mysql",
  host: isProduction ? undefined : process.env.DB_HOST,
  socketPath: isProduction ? process.env.INSTANCE_UNIX_SOCKET : undefined,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "app-data",
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: isProduction ? ["dist/entities/*.js"] : ["src/entities/*.ts"],
  // logging: true,
});

(async () => {
  if (isProduction) await fetchSecrets();
  try {
    await new DataSource(getDataSourceOptions()).initialize();

    logger.info("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization", err);
    throw err;
  }
})();

export const AppDataSource = new DataSource(getDataSourceOptions());
