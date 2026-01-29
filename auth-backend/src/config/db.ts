import mongoose from "mongoose";

import env from "./env";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Failed.`);
    console.error((error as Error).message);

    // Stop the process if unable to connect to the database
    process.exit(1);
  }
};

export default connectDB;
