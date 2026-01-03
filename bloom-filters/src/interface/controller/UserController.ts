import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/User';

export class UserController {
    constructor(private registerUseCase: RegisterUserUseCase) { }

    async handleRegister(req: Request, res: Response) {
        try {
            const { name, email } = req.body;
            const user = await this.registerUseCase.execute(name, email);
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}