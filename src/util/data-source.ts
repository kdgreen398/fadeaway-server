import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import logger from "./logger";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.NODE_ENV === "production" ? undefined : process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  socketPath:
    process.env.NODE_ENV === "production"
      ? process.env.INSTANCE_UNIX_SOCKET
      : undefined,
  database: "app-data",
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ["entities/*.js"],
  // logging: true,
});

AppDataSource.initialize()
  .then(() => {
    logger.info("Data Source has been initialized!");
  })
  .catch((err: unknown) => {
    console.error("Error during Data Source initialization", err);
    throw err;
  });
