import "dotenv/config";

// Express
import express from "express";
const app = express();

// Session
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "./lib/prisma.js";

const sessionStore = new PrismaSessionStore(prisma, {
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 15, // 15 days, ms * minute * hour * day * day_count
    },
  }),
);

// Passport.js config
import passport from "passport";
import flash from "connect-flash";

app.use(passport.session());

import "./lib/passport.js";

app.use(flash());

// Middleware to parse URL-encoded bodies (text data and JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// View
app.set("/views");
app.set("view engine", "ejs");

// Routers
import { indexRouter } from "./routes/indexRouter.js";
import { authRouter } from "./routes/authRouter.js";
import { postRouter } from "./routes/postRouter.js";
import { folderRouter } from "./routes/folderRouter.js";

app.use("/auth", authRouter);
app.use("/folder", folderRouter);
app.use("/post", postRouter);
app.use("/", indexRouter);

// Listen
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on port: " + port);
});
