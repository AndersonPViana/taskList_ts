import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv";

import { User } from "./entity/User"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: process.env.PASSWORD,
    database: "tasklist_ts",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
