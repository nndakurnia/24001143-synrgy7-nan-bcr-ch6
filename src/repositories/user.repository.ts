import { User, UserModel } from '../models/user.model';

export class UserRepository {
  async create(user: Partial<User>): Promise<User> {
    return await UserModel.query().insert(user);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await UserModel.query().findOne({ email });
  }

  async findById(id: number): Promise<User | undefined> {
    return await UserModel.query().findById(id);
  }
}
