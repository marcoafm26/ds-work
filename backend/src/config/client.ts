import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

// Função para cleanup (importante!)
export async function disconnect() {
    await prisma.$disconnect();
}

export default prisma;
