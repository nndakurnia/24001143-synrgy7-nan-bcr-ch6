import { CarRepository } from "../repositories/car.repository";
import { Car } from "../models/car.model";

export class CarService {
  constructor(private readonly carRepository: CarRepository) { }

  // for admin and superadmin only
  async getAllCars(): Promise<Car[]> {
    const data = await this.carRepository.getAll();

    if (data) {
      return data;
    } else {
      throw new Error('No car data!');
    }
  }

  // for all user: show the car that is_available = true
  async getAvailableCars(): Promise<Car[]> {
    const availableData = await this.carRepository.getAvailable();

    if (availableData) {
      return availableData;
    } else {
      throw new Error('No available car data!');
    }
  }

  async getCarById(id: number): Promise<Car | undefined> {
    const findData = await this.carRepository.findById(id);

    if (findData) {
      return findData;
    } else {
      throw new Error('Car not found!');
    }
  }

  async createCar(payload: Partial<Car>, requestUser: number, file?: Express.Multer.File): Promise<Car> {
    if (!payload.plate || !payload.name || !payload.rent_cost || !payload.capacity || !payload.type) {
      throw new Error('Required fields are missing!');
    }

    // Check if plate number is unique
    const existingCar = await this.carRepository.getPlate(payload.plate as string)
    if (existingCar) {
      throw new Error('Car with this plate already exists!');
    }

    const car = await this.carRepository.getAll();
    const id = car.length + 1

    const newCar: Partial<Car> = {
      ...payload,
      created_at: new Date(),
      created_by: requestUser,
      updated_at: new Date(),
      updated_by: requestUser,
      deleted_at: null,
      deleted_by: null,
    };

    try {
      if (file) {
        const imageUrl = await this.carRepository.uploadImageAndSave(id, file);
        newCar.image = imageUrl;
      } else {
        newCar.image = "https://res.cloudinary.com/dpif60wfq/image/upload/v1717425959/uz7l4onwpaaftklhd4mv.jpg";
      }

      const createdCar = await this.carRepository.create(newCar);
      return createdCar;
    } catch (error) {
      throw new Error('Failed to create car!');
    }
  }

  async updateCar(id: number, payload: Partial<Car>, requestUser: number, file?: Express.Multer.File): Promise<Car | undefined> {
    const existingCar = await this.carRepository.findById(id);
    if (!existingCar) {
      throw new Error('Car not found!');
    }

    const updateCar: Partial<Car> = {
      ...payload,
      updated_at: new Date(),
      updated_by: requestUser,
    };

    try {
      if (file) {
        const imageUrl = await this.carRepository.uploadImageAndSave(id, file);
        updateCar.image = imageUrl;
      } else {
        updateCar.image = existingCar.image;
      }

      const updatedCar = await this.carRepository.updateCar(id, updateCar);
      return updatedCar;
    } catch (error) {
      throw new Error('Failed to update car!');
    }
  }

  async deleteCar(id: number, deletedBy: number): Promise<void> {
    const car = await this.carRepository.findById(id);
    if (!car) {
      throw new Error('Car not found!');
    }

    await this.carRepository.delete(id, deletedBy);
  }
}
