import { Request, Response } from 'express';
import { CarService } from '../services/car.service';
import { Car } from '../models/car.model';
import { UserRequest } from '../types/request';

export class CarController {
  constructor(private readonly carService: CarService) { }

  async getAllCars(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.carService.getAllCars();

      res.status(200).json({ message: 'Success', data });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  // for member
  async getAvailableCars(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.carService.getAvailableCars();

      res.status(200).json({ message: 'Success', data });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async getCarById(req: Request, res: Response): Promise<void> {
    const id = +req.params.id;

    try {
      const data = await this.carService.getCarById(id);

      res.status(200).json({ message: 'Success', data });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async createCar(req: Request & UserRequest, res: Response): Promise<void> {
    const carData: Partial<Car> = req.body;
    const requestUser = req.user?.id;
    const file = req.file as Express.Multer.File;

    try {
      const newCar = await this.carService.createCar(carData, requestUser, file);

      res.status(201).json({ message: 'Car added successfully!', data: newCar });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async updateCar(req: Request & UserRequest, res: Response): Promise<void> {
    const id = +req.params.id;
    const updatedCarData: Partial<Car> = req.body;
    const requestUser = req.user?.id;
    const file = req.file as Express.Multer.File;

    try {
      const updatedCar = await this.carService.updateCar(id, updatedCarData, requestUser, file);

      if (updatedCar) {
        res.status(200).json({ message: 'Car updated successfully!', data: updatedCar });
      } else {
        res.status(404).json({ message: 'Car not found!' });
      }
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async deleteCar(req: UserRequest, res: Response): Promise<void> {
    const id = +req.params.id;
    const deletedBy = req.user?.id;

    try {
      await this.carService.deleteCar(id, deletedBy);

      res.status(200).json({ message: 'Car deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}
