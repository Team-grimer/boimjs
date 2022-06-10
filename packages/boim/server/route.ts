import express from "express";
import handleGetPage from "./controller";
import { Router } from "express";

const router: Router = express.Router();

router.get("*", handleGetPage);

export default router;
