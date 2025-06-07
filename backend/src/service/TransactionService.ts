import { TransactionType } from '@prisma/client';
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

        return new TransactionResponseDTO(createdTransaction);
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
                    createdAt: transaction.createdAt
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
}
