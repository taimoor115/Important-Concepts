import express from 'express';
import dotenv from 'dotenv';
import { PrismaUserRepository } from './infrastructure/repositories/UserRepository';
import { BloomFilterService } from './infrastructure/bloom/BloomFilterService';
import { RegisterUserUseCase } from './application/use-cases/User';
import { UserController } from './interface/controller/UserController';

dotenv.config();

const app = express();
app.use(express.json());


const userRepo = new PrismaUserRepository();
const bloomService = new BloomFilterService();
const registerUseCase = new RegisterUserUseCase(userRepo, bloomService);
const userController = new UserController(registerUseCase);


bloomService.initializeFilter().then(() => console.log("Bloom Filter Ready"));

app.post('/users', (req, res) => userController.handleRegister(req, res));

app.listen(3000, () => console.log('Server running on port 3000'));