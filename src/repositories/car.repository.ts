import { Car, CarModel } from "../models/car.model";
import { UploadApiResponse } from "cloudinary";
import cloudinary from "../middleware/cloudinary";

export class CarRepository {
  async getAll(): Promise<Car[]> {
    return await CarModel.query();
  }

  async getAvailable(): Promise<Car[]> {
    return await CarModel.query().where({ is_available: true });
  }

  async findById(id: number): Promise<Car | undefined> {
    return await CarModel.query().findById(id);
  }

  // untuk cek plate harus unik/tidak sama dengan plate yg sudah ada di db
  async getPlate(plate: string): Promise<Car | undefined> {
    return await CarModel.query().findOne({ plate });
  }

  // Partial<Car> digunakan untuk menunjukkan bahwa tidak semua properti dari objek Car harus disertakan dalam data yang diberikan
  async create(car: Partial<Car>): Promise<Car> {
    return await CarModel.query().insert(car);
  }

  async updateCar(id: number, updatedCar: Partial<Car>): Promise<Car | undefined> {
    await CarModel.query().findById(id).patch(updatedCar);
    return await CarModel.query().findById(id);
  }

  async delete(id: number, deletedBy: number): Promise<void> {
    await CarModel.query().findById(id).patch({
      deleted_at: new Date(),
      deleted_by: deletedBy,
    });
  }

  async uploadImageAndSave(carId: number, file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const fileBase64 = file.buffer.toString('base64');
        const fileData = `data:${file.mimetype};base64,${fileBase64}`;

        cloudinary.uploader.upload(fileData, async (err: Error, result: UploadApiResponse) => {
          if (err) {
            reject('Image upload failed');
          } else {
            const imageUrl = result.url;

            await CarModel.query().findById(carId).patch({ image: imageUrl });
            resolve(imageUrl);
          }
        });
      } catch (error) {
        reject('Unexpected error during file upload');
      }
    });
  }
}
