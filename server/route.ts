import express, { Router } from "express";

import handleGetPage from "./controller";

const router: Router = express.Router();

router.get("*", handleGetPage);

export default router;
