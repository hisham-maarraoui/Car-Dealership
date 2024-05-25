const express = require("express");
const Car = require("../models/car");

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
  .post((req, res, next) => {
    Car.create(req.body)
      .then((car) => {
        console.log("Car Created ", car);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(car);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /cars");
  })
  .delete((req, res, next) => {
    Car.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

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
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /cars/${req.params.carVIN}`
    );
  })
  .put((req, res, next) => {
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
  .delete((req, res, next) => {
    Car.findByIdAndDelete(req.params.carVIN)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

  carRouter.route('/:carVIN/comments')
  .get((req, res, next) => {
      Car.findById(req.params.carVIN)
      .then(car => {
          if (car) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(car.comments);
          } else {
              err = new Error(`Car ${req.params.carVIN} not found`);
              err.status = 404;
              return next(err);
          }
      })
      .catch(err => next(err));
  })
  .post((req, res, next) => {
      Car.findById(req.params.carVIN)
      .then(car => {
          if (car) {
              car.comments.push(req.body);
              car.save()
              .then(car => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(car);
              })
              .catch(err => next(err));
          } else {
              err = new Error(`Car ${req.params.carVIN} not found`);
              err.status = 404;
              return next(err);
          }
      })
      .catch(err => next(err));
  })
  .put((req, res) => {
      res.statusCode = 403;
      res.end(`PUT operation not supported on /cars/${req.params.carVIN}/comments`);
  })
  .delete((req, res, next) => {
      Car.findById(req.params.carVIN)
      .then(car => {
          if (car) {
              for (let i = (car.comments.length-1); i >= 0; i--) {
                  car.comments.id(car.comments[i]._id).deleteOne();
              }
              car.save()
              .then(car => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(car);
              })
              .catch(err => next(err));
          } else {
              err = new Error(`Car ${req.params.carVIN} not found`);
              err.status = 404;
              return next(err);
          }
      })
      .catch(err => next(err));
  });
  
  carRouter.route('/:carVIN/comments/:commentId')
  .get((req, res, next) => {
      Car.findById(req.params.carVIN)
      .then(car => {
          if (car && car.comments.id(req.params.commentId)) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(car.comments.id(req.params.commentId));
          } else if (!car) {
              err = new Error(`Car ${req.params.carVIN} not found`);
              err.status = 404;
              return next(err);
          } else {
              err = new Error(`Comment ${req.params.commentId} not found`);
              err.status = 404;
              return next(err);
          }
      })
      .catch(err => next(err));
  })
  .post((req, res) => {
      res.statusCode = 403;
      res.end(`POST operation not supported on /cars/${req.params.carVIN}/comments/${req.params.commentId}`);
  })
  .put((req, res, next) => {
      Car.findById(req.params.carVIN)
      .then(car => {
          if (car && car.comments.id(req.params.commentId)) {
              if (req.body.rating) {
                  car.comments.id(req.params.commentId).rating = req.body.rating;
              }
              if (req.body.text) {
                  car.comments.id(req.params.commentId).text = req.body.text;
              }
              car.save()
              .then(car => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(car);
              })
              .catch(err => next(err));
          } else if (!car) {
              err = new Error(`Car ${req.params.carVIN} not found`);
              err.status = 404;
              return next(err);
          } else {
              err = new Error(`Comment ${req.params.commentId} not found`);
              err.status = 404;
              return next(err);
          }
      })
      .catch(err => next(err));
  })
  .delete((req, res, next) => {
      Car.findById(req.params.carVIN)
      .then(car => {
          if (car && car.comments.id(req.params.commentId)) {
              car.comments.id(req.params.commentId).deleteOne();
              car.save()
              .then(car => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(car);
              })
              .catch(err => next(err));
          } else if (!car) {
              err = new Error(`Car ${req.params.carVIN} not found`);
              err.status = 404;
              return next(err);
          } else {
              err = new Error(`Comment ${req.params.commentId} not found`);
              err.status = 404;
              return next(err);
          }
      })
      .catch(err => next(err));
  });
  
  module.exports = carRouter;  