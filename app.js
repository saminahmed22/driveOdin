import "dotenv/config";

// Express
import express from "express";
const app = express();

// Route
import { indexRouter } from "./routes/indexRouter.js";
app.use(indexRouter);

// View
app.set("/views");
app.set("view engine", "ejs");

// Static files
app.use(express.static("public"));

// Listen
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on port: " + port);
});
