require("dotenv").config();

const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const dbUri = process.env.MONGO_ATLAS_URI;
const sessionSecret = process.env.SECRET;

/* -------------------- EXPRESS CONFIG -------------------- */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

/* -------------------- DATABASE CONNECTION -------------------- */

async function connectDB() {
  try {
    await mongoose.connect(dbUri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
}

/* -------------------- START SERVER -------------------- */

async function startServer() {
  await connectDB();

  /* -------------------- SESSION STORE -------------------- */

  const store = MongoStore.create({
    mongoUrl: dbUri,
    crypto: {
      secret: sessionSecret,
    },
    touchAfter: 24 * 3600,
  });

  store.on("error", (err) => {
    console.log("❌ SESSION STORE ERROR:", err);
  });

  app.use(
    session({
      store,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      },
    }),
  );

  app.use(flash());

  /* -------------------- PASSPORT CONFIG -------------------- */

  app.use(passport.initialize());
  app.use(passport.session());

passport.use(
  new LocalStrategy({ usernameField: "email" }, User.authenticate()),
);
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  /* -------------------- GLOBAL MIDDLEWARE -------------------- */

  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
  });

  /* -------------------- ROUTES -------------------- */

  app.use("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
  });

  app.use("/listings", listingRouter);
  app.use("/listings/:id/reviews", reviewRouter);
  app.use("/", userRouter);

  /* -------------------- 404 HANDLER -------------------- */

  app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
  });

  /* -------------------- ERROR HANDLER -------------------- */

  app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    let { statusCode = 500, message = "Something went Wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
  });

  /* -------------------- SERVER -------------------- */

  app.listen(8080, () => {
    console.log("🚀 Server running on port 8080");
  });
}

startServer();
