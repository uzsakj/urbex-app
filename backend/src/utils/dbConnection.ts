import { AppDataSource } from "../data-source.ts";

export async function connectToDatabase() {
    AppDataSource.initialize().then(() => {
        console.log("Database connected!");
    });

}