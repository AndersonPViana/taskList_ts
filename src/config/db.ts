import { AppDataSource } from "../data-source";

export const connectionServerDB = async () => {
  const connection = await AppDataSource.initialize();
  console.log(`App conected DB ${connection.options.database}`);

  process.on("SIGINT", () => {
    connection.destroy().then(() => console.log("closed connection"))
  });
}