import { Request, Response } from 'express';
import { TransactionRequestDTO } from '../dto/transaction/TransactionRequestDTO';
import { AccountService } from '../service/AccountService';
import { TransactionService } from '../service/TransactionService';

export class TransactionController {
    private transactionService: TransactionService;
    private accountService: AccountService;

    constructor() {
        this.transactionService = new TransactionService();
        this.accountService = new AccountService();
    }

    async create(req: Request, res: Response) {
        try {
            const { accountId, amount, type } = req.body;

            const transactionDTO = new TransactionRequestDTO({
                accountId: parseInt(accountId),
                amount: parseFloat(amount),
                type
            });

            const validationErrors = transactionDTO.validate();
            if (!validationErrors.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validationErrors.errors
                });
            }

            const createdTransaction = await this.transactionService.create(
                transactionDTO
            );

            return res.status(201).json({
                success: true,
                message: 'Transação criada com sucesso!',
                data: createdTransaction
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const { accountId, amount, type } = req.params;
            const transactions = await this.transactionService.findAll(
                parseInt(accountId)
            );

            return res.status(200).json({
                success: true,
                message: 'Transações encontradas com sucesso!',
                data: transactions.map((transaction) =>
                    transaction.toPrismaData()
                )
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }

    async getAccountBalance(req: Request, res: Response) {
        try {
            const { accountId } = req.params;

            // Verificar se accountId é válido
            if (!accountId || isNaN(parseInt(accountId))) {
                return res.status(400).json({
                    success: false,
                    errors: ['ID da conta inválido']
                });
            }

            const balance = await this.transactionService.getAccountBalance(
                parseInt(accountId)
            );

            return res.status(200).json({
                success: true,
                message: 'Saldo da conta obtido com sucesso!',
                data: {
                    accountId: parseInt(accountId),
                    balance: balance,
                    formattedBalance: `R$ ${balance
                        .toFixed(2)
                        .replace('.', ',')}`
                }
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }
}
