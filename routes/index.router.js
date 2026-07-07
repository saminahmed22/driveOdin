// Router
import Router from "express";
export const indexRouter = Router();

// Controllers
import { renderIndex } from "../controllers/index.controller.js";

// Middlewares
import { authenticationStatus } from "../middlewares/authenticationStatus.js";

// Routes

//____get
indexRouter.get("/", authenticationStatus, renderIndex);
