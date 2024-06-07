const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const authenticate = require("../authenticate");

const userRouter = express.Router();

/* GET users listing. */
userRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      })
      .catch((err) => next(err));
  });

userRouter.post("/signup", async (req, res) => {
  try {
    const { username, password, firstname, lastname } = req.body;

    if (!username || !password) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.json({ err: "Username and password are required." });
    }

    if (!firstname || !lastname) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      return res.json({ err: "Firstname and lastname are required." });
    }

    const user = new User({ username, firstname, lastname });
    await User.register(user, password);

    try {
      await user.save();

      passport.authenticate("local")(req, res, () => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ success: true, status: "Registration Successful!" });
      });
    } catch (saveErr) {
      console.log("saveErr");
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: saveErr.message || saveErr });
    }
  } catch (registerErr) {
    console.log("registerErr");
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.json({ err: registerErr.message || registerErr });
  }
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
    });
  }
);

userRouter.get("/logout", cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    const err = new Error("You are not logged in!");
    err.status = 401;
    return next(err);
  }
});

module.exports = userRouter;
