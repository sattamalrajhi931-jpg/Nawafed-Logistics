import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mandoobRouter from "./mandoob";
import authRouter from "./auth";
import contentRouter from "./content";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/mandoob", mandoobRouter);
router.use("/auth", authRouter);
router.use("/content", contentRouter);

export default router;
