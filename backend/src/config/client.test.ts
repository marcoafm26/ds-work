import prisma from './client';

describe('Database Connection Tests', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should successfully connect to database', async () => {
        const result = await prisma.$executeRaw`SELECT 1 as test`;
        expect(result).toBeGreaterThanOrEqual(0);
    });

    it('should be able to count records from main tables', async () => {
        const clientCount = await prisma.tbClient.count();
        const accountCount = await prisma.tbAccount.count();
        const transactionCount = await prisma.tbTransaction.count();

        expect(typeof clientCount).toBe('number');
        expect(typeof accountCount).toBe('number');
        expect(typeof transactionCount).toBe('number');
    });

    describe('Test User Creation', () => {
        const TEST_USER = {
            name: 'João da Silva Teste',
            cpf: '12345678901',
            phone: '11999999999',
            password: 'senha123'
        };

        beforeAll(async () => {
            // Delete test data if exists
            const existingClient = await prisma.tbClient.findUnique({
                where: { cpf: TEST_USER.cpf },
                include: {
                    accounts: {
                        include: {
                            transactions: true
                        }
                    }
                }
            });

            if (existingClient) {
                await prisma.tbClient.delete({
                    where: { id: existingClient.id }
                });
            }
        });

        it('should handle existing test user', async () => {
            const existingClient = await prisma.tbClient.findUnique({
                where: { cpf: TEST_USER.cpf }
            });

            expect(existingClient).toBeNull();
        });

        it('should create test user with account and initial transaction if not exists', async () => {
            const existingClient = await prisma.tbClient.findUnique({
                where: { cpf: TEST_USER.cpf }
            });

            if (!existingClient) {
                // Create client
                const newClient = await prisma.tbClient.create({
                    data: TEST_USER
                });
                expect(newClient).toHaveProperty('id');
                expect(newClient.cpf).toBe(TEST_USER.cpf);

                // Create account
                const newAccount = await prisma.tbAccount.create({
                    data: {
                        number: '123456789',
                        clientId: newClient.id
                    }
                });
                expect(newAccount).toHaveProperty('id');
                expect(newAccount.clientId).toBe(newClient.id);

                // Create initial transaction
                const initialTransaction = await prisma.tbTransaction.create({
                    data: {
                        amount: 1000.0,
                        type: 'CREDIT',
                        accountId: newAccount.id
                    }
                });
                expect(initialTransaction).toHaveProperty('id');
                expect(parseFloat(initialTransaction.amount.toString())).toBe(
                    1000.0
                );
                expect(initialTransaction.accountId).toBe(newAccount.id);
            }
        });

        it('should verify final client count', async () => {
            const finalCount = await prisma.tbClient.count();
            expect(typeof finalCount).toBe('number');
            expect(finalCount).toBeGreaterThan(0);
        });

        afterAll(async () => {
            // Cleanup: Delete test data
            const existingClient = await prisma.tbClient.findUnique({
                where: { cpf: TEST_USER.cpf },
                include: {
                    accounts: {
                        include: {
                            transactions: true
                        }
                    }
                }
            });

            if (existingClient) {
                await prisma.tbClient.delete({
                    where: { id: existingClient.id }
                });
            }
        });
    });
});
