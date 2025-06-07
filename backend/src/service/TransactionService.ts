import { TransactionType } from '@prisma/client';
import { AccountResponseDTO } from '../dto/account/AccountResponseDTO';
import { TransactionRequestDTO } from '../dto/transaction/TransactionRequestDTO';
import { TransactionResponseDTO } from '../dto/transaction/TransactionResponseDTO';
import { AccountRepository } from '../repository/AccountRepository';
import { TransactionRepository } from '../repository/TransactionRepository';

export class TransactionService {
    private transactionRepository: TransactionRepository;
    private accountRepository: AccountRepository;

    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.accountRepository = new AccountRepository();
    }

    async create(
        transactionData: TransactionRequestDTO
    ): Promise<TransactionResponseDTO> {
        // Verificar se a conta existe
        const account = await this.accountRepository.findById(
            transactionData.accountId
        );
        if (!account) {
            throw new Error('Conta não encontrada!');
        }

        // Verificar se há saldo suficiente para saque
        if (transactionData.type === TransactionType.DEBIT) {
            const currentBalance =
                await this.transactionRepository.getAccountBalance(
                    transactionData.accountId
                );

            if (currentBalance < transactionData.amount) {
                throw new Error(
                    'Saldo insuficiente para realizar a transação!'
                );
            }
        }

        // Criar a transação
        const createdTransaction = await this.transactionRepository.create(
            transactionData.toPrismaData()
        );

        return new TransactionResponseDTO({
            id: createdTransaction.id,
            amount: createdTransaction.amount,
            type: createdTransaction.type,
            accountId: createdTransaction.accountId,
            createdAt: createdTransaction.createdAt,
            transference: createdTransaction.transference || undefined
        });
    }

    async findAll(accountId: number): Promise<TransactionResponseDTO[]> {
        const transactions = await this.transactionRepository.findAll(
            accountId
        );
        return transactions.map(
            (transaction) =>
                new TransactionResponseDTO({
                    id: transaction.id,
                    amount: transaction.amount,
                    type: transaction.type,
                    accountId: transaction.accountId,
                    createdAt: transaction.createdAt,
                    transference: transaction.transference || 0
                })
        );
    }

    async getAccountBalance(accountId: number): Promise<number> {
        // Verificar se a conta existe
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new Error('Conta não encontrada!');
        }

        return await this.transactionRepository.getAccountBalance(accountId);
    }

    async transference(
        accountDto: AccountResponseDTO,
        targetAccountDto: AccountResponseDTO,
        amount: number
    ) {
        if (accountDto.balance < amount) {
            throw new Error('Saldo insuficiente para realizar a transação!');
        }

        if (accountDto.id === targetAccountDto.id) {
            throw new Error('Não é possível transferir para a mesma conta!');
        }

        if (accountDto.clientId !== targetAccountDto.clientId) {
            const taxAmount = amount * 0.9;
            const transactionDTO = new TransactionRequestDTO({
                accountId: accountDto.id,
                amount: amount,
                type: TransactionType.DEBIT,
                transference: 1
            });
            await this.create(transactionDTO);

            const targetTransactionDTO = new TransactionRequestDTO({
                accountId: targetAccountDto.id,
                amount: taxAmount,
                type: TransactionType.CREDIT,
                transference: 1
            });
            await this.create(targetTransactionDTO);
        } else {
            const transactionDTO = new TransactionRequestDTO({
                accountId: accountDto.id,
                amount: amount,
                type: TransactionType.DEBIT,
                transference: 1
            });
            await this.create(transactionDTO);
            const targetTransactionDTO = new TransactionRequestDTO({
                accountId: targetAccountDto.id,
                amount: amount,
                type: TransactionType.CREDIT,
                transference: 1
            });
            await this.create(targetTransactionDTO);
        }
    }
}
