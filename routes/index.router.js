// Router
import Router from "express";
export const indexRouter = Router();

// Controllers
import { renderIndex, createFolder } from "../controllers/index.controller.js";

// Middlewares
import { authenticationStatus } from "../middlewares/authenticationStatus.js";

// Routes

//____get
indexRouter.get("/", authenticationStatus, renderIndex);

//____post
indexRouter.post("/new_folder", authenticationStatus, createFolder);
