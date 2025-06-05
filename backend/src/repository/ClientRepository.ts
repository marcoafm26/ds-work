import { Prisma } from '@prisma/client';
import prisma from '../config/client';

export class ClientRepository {
    async create(data: Prisma.TbClientCreateInput) {
        const client = await prisma.tbClient.create({ data });
        return client;
    }

    async delete(id: number) {
        const client = await prisma.tbClient.delete({ where: { id } });
        return client;
    }

    async update(id: number, data: Prisma.TbClientUpdateInput) {
        const client = await prisma.tbClient.update({
            data,
            where: {
                id: id
            }
        });
        return client;
    }

    async findById(id: number) {
        const client = await prisma.tbClient.findUnique({ where: { id } });
        return client;
    }

    async findByCpf(cpf: string) {
        const client = await prisma.tbClient.findUnique({ where: { cpf } });
        return client;
    }
}
