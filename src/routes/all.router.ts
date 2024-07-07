import { Router } from "express";
import { CarRepository } from "../repositories/car.repository";
import { CarService } from "../services/car.service";
import { CarController } from "../controllers/car.controller";

const allRouter = Router();
const carRepository = new CarRepository();
const carService = new CarService(carRepository);
const carController = new CarController(carService);

// routes show available cars for member
allRouter.get("/", carController.getAvailableCars.bind(carController));

export default allRouter;
