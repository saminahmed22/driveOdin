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

// Middleware to parse URL-encoded bodies (text data and JSON)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
import { indexRouter } from "./routes/indexRouter.js";
import { authRouter } from "./routes/auth.js";

app.use("/auth", authRouter);
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
