import mongoose from "mongoose";

const connect = async (mongoUri) => {
  if (!mongoUri) {
    console.warn("MONGODB_URI not provided; skipping mongoose connect");
    return;
  }
  try {
    await mongoose.connect(mongoUri, {
      // sensible defaults; tune as needed
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    throw err;
  }
};

export default { connect, mongoose };
