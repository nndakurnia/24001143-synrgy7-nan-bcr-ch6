import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { UserRequest } from "../types/request";
import dotenv from "dotenv";
dotenv.config();

export class UserController {
  constructor(private readonly userService: UserService) { }

  async registerUser(req: Request, res: Response): Promise<void> {
    try {
      await this.userService.registerUser(req.body);

      res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
      return;
    }
  }

  async registerAdmin(req: Request, res: Response): Promise<void> {
    try {
      await this.userService.registerAdmin(req.body);
      
      res.status(201).json({ message: 'Admin successfully added!' });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
      return;
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const { message, token } = await this.userService.login(email, password);

      res.status(200).json({ message, token });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
      return;
    }
  }

  async getCurrentUser(req: UserRequest, res: Response): Promise<void> {
    const id = req.user?.id;
    
    try {
      const user = await this.userService.getCurrentUser(id);
      
      res.status(200).json({ message: 'Success', data: user });
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
      return;
    }
  }
} 
