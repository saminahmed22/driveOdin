import Router from "express";

// Controllers
import { renderIndex } from "../controllers/indexController.js";

// Express Router initialization
export const indexRouter = Router();

// Routes
indexRouter.get("/", renderIndex);
