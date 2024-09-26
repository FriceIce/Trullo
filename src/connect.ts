import mongoose from "mongoose";
import "dotenv/config";

const db = mongoose.connection;

async function connectDB() {
  const DB_URL = process.env.DB_URL;

  try {
    await mongoose.connect(String(DB_URL));
  } catch (error) {
    console.log("Error on line 12, path: connect.ts");
  }
}

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to MongoDB"));
db.on("disconnected", () => console.log("Disconnected from MongoDB"));

export { mongoose, connectDB };
