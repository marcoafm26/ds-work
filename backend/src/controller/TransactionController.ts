import { TransactionType } from '@prisma/client';
import { Request, Response } from 'express';
import { TransactionRequestDTO } from '../dto/transaction/TransactionRequestDTO';
import { AccountService } from '../service/AccountService';
import { TransactionService } from '../service/TransactionService';

export default class TransactionController {
    private transactionService: TransactionService;
    private accountService: AccountService;

    constructor() {
        this.transactionService = new TransactionService();
        this.accountService = new AccountService();
    }

    async create(req: Request, res: Response) {
        try {
            const { accountId, amount, type, transference } = req.body;

            const transactionDTO = new TransactionRequestDTO({
                accountId: parseInt(accountId),
                amount: parseFloat(amount),
                type,
                transference: parseInt(transference)
            });

            const validationErrors = transactionDTO.validate();
            if (!validationErrors.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: validationErrors.errors
                });
            }

            if (transactionDTO.type === TransactionType.CREDIT) {
                let totalBalance = 0;
                const account = await new AccountService().findById(
                    parseInt(accountId)
                );

                let accounts = await this.accountService.findAll(
                    account.clientId
                );
                accounts.forEach((account) => {
                    totalBalance += account.balance;
                });

                let transaction;

                if (transactionDTO.amount > totalBalance) {
                    transaction = await this.transactionService.create(
                        new TransactionRequestDTO({
                            accountId: parseInt(accountId),
                            amount: parseFloat(amount) * 1.1,
                            type: 'CREDIT'
                        })
                    );
                } else {
                    transaction = await this.transactionService.create(
                        transactionDTO
                    );
                }

                return res.status(201).json({
                    success: true,
                    message: 'Transação criada com sucesso!',
                    data: transaction
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

    async transference(req: Request, res: Response) {
        try {
            const { accountId, targetAccountId, amount } = req.body;
            const accountDto = await new AccountService().findById(
                parseInt(accountId)
            );
            const accountValidation = accountDto.validate();
            if (!accountValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: accountValidation.errors
                });
            }

            const targetAccountDto = await new AccountService().findById(
                parseInt(targetAccountId)
            );
            const targetAccountValidation = targetAccountDto.validate();
            if (!targetAccountValidation.isValid) {
                return res.status(400).json({
                    success: false,
                    errors: targetAccountValidation.errors
                });
            }

            const transference = await new TransactionService().transference(
                accountDto,
                targetAccountDto,
                parseFloat(amount)
            );

            return res.status(200).json({
                success: true,
                message: 'Transferência realizada com sucesso!',
                data: transference
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                errors: [error?.message]
            });
        }
    }
}
