import { Router } from "express";
import { CarRepository } from "../repositories/car.repository";
import { CarService } from "../services/car.service";
import { CarController } from "../controllers/car.controller";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import auth from "../middleware/auth";
import cdnUpload from "../middleware/cdnUploadHandler";

const adminRouter = Router();

const carRepository = new CarRepository();
const carService = new CarService(carRepository);
const carController = new CarController(carService);

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

adminRouter.use(auth.authenticate);

adminRouter.get("/cars/", auth.authorize(['superadmin', 'admin']), carController.getAllCars.bind(carController));
adminRouter.get("/cars/available", auth.authorize(['superadmin', 'admin']), carController.getAvailableCars.bind(carController));
adminRouter.get("/cars/:id", auth.authorize(['superadmin', 'admin']), carController.getCarById.bind(carController));
adminRouter.post("/cars/", auth.authorize(['superadmin', 'admin']), cdnUpload.single('image'), carController.createCar.bind(carController));
adminRouter.patch("/cars/:id", auth.authorize(['superadmin', 'admin']), cdnUpload.single('image'), carController.updateCar.bind(carController));
adminRouter.delete("/cars/:id", auth.authorize(['superadmin', 'admin']), carController.deleteCar.bind(carController));

// register admin by SUPERADMIN
adminRouter.post("/register", auth.authorize(['superadmin']),
    userController.registerAdmin.bind(userController));

export default adminRouter;
