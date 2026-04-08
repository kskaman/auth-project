import express from "express";
import helmet from "helmet";

import router from "./routes/index";
import notFound from "./middlewares/notFound.middleware";
import errorHandler from "./middlewares/error.middleware";

import { globalLimiter } from "./middlewares/rateLimit.middleware";
import { sanitize } from "./middlewares/sanitize.middleware";

const app = express();

app.use(helmet());
app.use(globalLimiter);
app.use(sanitize);

app.use(express.json());

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

export default app;
