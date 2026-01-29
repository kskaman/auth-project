import express from "express";

import router from "./routes/index";
import notFound from "./middlewares/notFound.middleware";
import errorHandler from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);

export default app;
