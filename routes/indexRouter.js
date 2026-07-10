// Router
import Router from "express";
export const indexRouter = Router();

// Controllers
import { renderIndex } from "../controllers/indexController.js";

// Middlewares
import { authenticationStatus } from "../models/authModel.js";
import { fetchAlluserData } from "../middlewares/fetchAlluserData.js";

// Routes

//____get
indexRouter.get("/", authenticationStatus, fetchAlluserData, renderIndex);
