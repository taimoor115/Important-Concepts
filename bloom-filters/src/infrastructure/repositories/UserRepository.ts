import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "../../core/repositories/IUserRepository";
import { User } from "../../core/entities/User";

export class PrismaUserRepository implements IUserRepository {
    private prisma = new PrismaClient();

    async save(user: User): Promise<void> {
        await this.prisma.user.create({ data: user });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: { email } });
    }
}