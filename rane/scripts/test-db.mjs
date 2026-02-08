import mongoose from "mongoose";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(".", ".env.local") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

console.log("Connecting to MongoDB...");
try {
  await mongoose.connect(uri);
  console.log("Connected successfully!");
  console.log("Database:", mongoose.connection.db.databaseName);
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map((c) => c.name).join(", ") || "(none yet)");
  await mongoose.disconnect();
  console.log("Disconnected. Everything looks good!");
} catch (err) {
  console.error("Connection failed:", err.message);
  process.exit(1);
}
