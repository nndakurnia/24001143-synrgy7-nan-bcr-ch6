import { Router } from "express";
import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";
import auth from "../middleware/auth";

const authRouter = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// login for all user
authRouter.post("/login", userController.login.bind(userController));
// register for member
authRouter.post("/register", userController.registerUser.bind(userController));
// untuk get current user berdasarkan token
authRouter.get("/me", auth.authenticate, userController.getCurrentUser.bind(userController));


export default authRouter;
