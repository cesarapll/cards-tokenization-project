import express from "express";
import cors from "cors";
import { authorizationMiddleware } from "./middlewares/authorization";
import tokenizationRouter from "./tokenization";
import redisClient from "./database/redis-client";
import { errorMiddleware } from "./middlewares/error";
import { config } from "dotenv";

const app = express();
const router = express.Router();
const port = 3000;

app.use(cors());
app.use(express.json());

config({ path: __dirname + "/.env" });

router.use("/", tokenizationRouter);
app.use(authorizationMiddleware);
app.use(router);
app.use(errorMiddleware);
(async () => {
  await redisClient.connect();
})();

app.listen(port, () => {
  console.log(`Server running in port ${process.env.PORT || 3000}`);
});
