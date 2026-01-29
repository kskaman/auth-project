import app from "./src/app";
import env from "./src/config/env";
import connectDB from "./src/config/db";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Server Failed to Start");
    console.error((error as Error).message);
    process.exit(1);
  }
};

startServer();
