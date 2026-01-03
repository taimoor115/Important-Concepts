import { User } from "../../core/entities/User";
import { IUserRepository } from "../../core/repositories/IUserRepository";
import { BloomFilterService } from "../../infrastructure/bloom/BloomFilterService";
import { randomUUID } from 'crypto';

export class RegisterUserUseCase {
    constructor(
        private userRepository: IUserRepository,
        private bloomFilter: BloomFilterService
    ) { }

    async execute(name: string, email: string) {

        const probablyExists = await this.bloomFilter.exists(email);

        if (probablyExists) {

            const actualUser = await this.userRepository.findByEmail(email);
            if (actualUser) {
                throw new Error("User already exists");
            }
        }


        const newUser = new User(randomUUID(), email, name);
        await this.userRepository.save(newUser);


        await this.bloomFilter.add(email);

        return newUser;
    }
}