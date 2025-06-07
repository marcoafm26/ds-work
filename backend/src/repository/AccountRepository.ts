import { Prisma } from '@prisma/client';
import prisma from '../config/client';

export class AccountRepository {
    async create(data: { number: string; clientId: number }) {
        const account = await prisma.tbAccount.create({ data });
        return account;
    }

    // async delete(id: number) {
    //     const account = await prisma.tbAccount.delete({ where: { id } });
    //     return account;
    // }

    async update(id: number, data: Prisma.TbAccountUpdateInput) {
        const account = await prisma.tbAccount.update({
            data,
            where: {
                id: id
            }
        });
        return account;
    }

    async findById(id: number) {
        const account = await prisma.tbAccount.findUnique({ where: { id } });
        return account;
    }

    async findByNumber(number: string) {
        const account = await prisma.tbAccount.findUnique({
            where: { number: number }
        });
        return account;
    }

    async findAll(clientId: number) {
        const accounts = await prisma.tbAccount.findMany({
            where: { clientId: clientId }
        });

        return accounts;
    }

    async findAllAccounts() {
        const accounts = await prisma.tbAccount.findMany();
        return accounts;
    }
}
