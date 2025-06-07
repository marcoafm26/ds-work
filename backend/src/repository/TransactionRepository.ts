import { Prisma, TransactionType } from '@prisma/client';
import prisma from '../config/client';

export class TransactionRepository {
    async create(data: { amount: number; type: TransactionType; accountId: number }) {
        const transaction = await prisma.tbTransaction.create({ data });
        return transaction;
    }

    async findAll(accountId: number) {
        const transactions = await prisma.tbTransaction.findMany({
            where: { accountId },
            orderBy: { createdAt: 'desc' },
            include: {
                account: true
            }
        });
        return transactions;
    }

    async getAccountBalance(accountId: number) {
        const creditTransactions = await prisma.tbTransaction.aggregate({
            where: { 
                accountId,
                type: TransactionType.CREDIT
            },
            _sum: {
                amount: true
            }
        });

        const debitTransactions = await prisma.tbTransaction.aggregate({
            where: { 
                accountId,
                type: TransactionType.DEBIT
            },
            _sum: {
                amount: true
            }
        });

        const credits = creditTransactions._sum.amount || 0;
        const debits = debitTransactions._sum.amount || 0;
        
        return Number(credits) - Number(debits);
    }
}