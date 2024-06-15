const express = require("express");
const Car = require("../models/car");
const authenticate = require("../authenticate");

const carRouter = express.Router();

carRouter
  .route("/")
  .get((req, res, next) => {
    Car.find()
      .then((cars) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(cars);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Car.create(req.body)
      .then((car) => {
        console.log("Car Created ", car);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(car);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /cars");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Car.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

carRouter
  .route("/:carVIN")
  .get((req, res, next) => {
    Car.findById(req.params.carVIN)
      .then((car) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(car);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /cars/${req.params.carVIN}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Car.findByIdAndUpdate(
      req.params.carVIN,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((car) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(car);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Car.findByIdAndDelete(req.params.carVIN)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

module.exports = carRouter;
