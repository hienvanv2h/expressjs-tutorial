import { Router } from "express";
import userRouter from "./users.mjs";
import productRouter from "./products.mjs";
import authRouter from "./auth.mjs";

const rootRouter = Router();

rootRouter.use(authRouter);
rootRouter.use(userRouter);
rootRouter.use(productRouter);

export default rootRouter;
