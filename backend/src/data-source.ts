import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Gamingkert753",
  database: "urbex_db",
  synchronize: true, // turn this off in prod
  logging: true,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
});
