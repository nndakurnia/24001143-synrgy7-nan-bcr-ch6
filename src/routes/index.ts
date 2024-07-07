import { Router } from "express";
import authRouter from "./auth.router";
import adminRouter from "./admin.router";
import allRouter from "./all.router";

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
router.use("/cars", allRouter);

export default router;
