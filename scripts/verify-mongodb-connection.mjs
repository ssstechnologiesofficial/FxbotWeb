import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  console.error("MongoDB ping verification failed: MONGODB_URI is not set");
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGODB_URI, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10_000,
  });
  await mongoose.connection.db.admin().ping();
  console.log("MongoDB ping verification: connected and primary reachable");
} catch (error) {
  console.error(
    `MongoDB ping verification failed: ${error?.name || "unknown error"}`,
  );
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect().catch(() => {});
  }
}