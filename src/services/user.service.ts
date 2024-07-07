import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY as string;

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async registerUser(payload: Partial<User>): Promise<User> {
    const { email, password } = payload;

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email!);
    if (existingUser) {
      throw new Error('Email already exists!');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password as string, 10);

    // user role defaultnya 'member'
    const newUser: Partial<User> = {
      ...payload,
      password: hashedPassword,
      created_at: new Date(),
    };

    return await this.userRepository.create(newUser);
  }

  async registerAdmin(payload: Partial<User>): Promise<User> {
    const { email, password } = payload;

    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(email!);
    if (existingUser) {
      throw new Error('Email already exists!');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password as string, 10);

    // Create new admin
    const newUser: Partial<User> = {
      ...payload,
      password: hashedPassword,
      user_role: 'admin',
      created_at: new Date(),
    };

    return await this.userRepository.create(newUser);
  }

  async login(email: string, password: string): Promise<{ message: string; token?: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    let passwordMatch = false;

    if (user.user_role === 'superadmin') {
      // Untuk superadmin, password tidak di-hash karena masukinnya dari seeder
      passwordMatch = password === user.password;
    } else {
      passwordMatch = await bcrypt.compare(password, user.password);
    }

    if (!passwordMatch) {
      throw new Error('Invalid username or password!');
    }

    const token = jwt.sign({ id: user.id, role: user.user_role }, secretKey, { expiresIn: '3d' });

    return { message: 'Success', token };
  }

  async getCurrentUser(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('User not found!');
    }

    return user;
  }
}
