import { AccountResponseDTO } from '../dto/account/AccountResponseDTO';
import { ClientResponseDTO } from '../dto/client/ClientResponseDTO';
import { AccountRepository } from '../repository/AccountRepository';
import { TransactionService } from './TransactionService';

export class AccountService {
    private accountRepository: AccountRepository;

    constructor() {
        this.accountRepository = new AccountRepository();
    }

    async create(client: ClientResponseDTO) {
        let numberAlreadyExists;
        let number;
        do {
            number =
                client.name.substring(0, 2).toUpperCase() +
                '_' +
                Math.floor(Math.random() * 1000000);
            numberAlreadyExists = await this.accountRepository.findByNumber(
                number
            );
        } while (numberAlreadyExists);

        const account = await this.accountRepository.create({
            number,
            clientId: client.id
        });
        const balance = await new TransactionService().getAccountBalance(
            account.id
        );
        return new AccountResponseDTO({ ...account, balance });
    }

    async findByNumber(accNumber: string) {
        const account = await this.accountRepository.findByNumber(accNumber);
        if (!account) {
            throw new Error('O número não foi encontrado!');
        }
        const balance = await new TransactionService().getAccountBalance(
            account.id
        );
        return new AccountResponseDTO({ ...account, balance });
    }

    async findById(accountId: number) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new Error('A conta não foi encontrada!');
        }
        const balance = await new TransactionService().getAccountBalance(
            account.id
        );
        return new AccountResponseDTO({ ...account, balance });
    }

    async findAll(clientId: number) {
        const accounts = await this.accountRepository.findAll(clientId);
        if (!accounts) {
            throw new Error('O cliente não possui contas!');
        }

        const accountsDto = [];
        for (const account of accounts) {
            const balance = await new TransactionService().getAccountBalance(
                account.id
            );
            accountsDto.push(new AccountResponseDTO({ ...account, balance }));
        }
        return accountsDto;
    }

    async findAllAccounts() {
        const accounts = await this.accountRepository.findAllAccounts();
        if (!accounts) {
            throw new Error('Não há contas cadastradas!');
        }
        const accountsDto = [];
        for (const account of accounts) {
            const balance = await new TransactionService().getAccountBalance(
                account.id
            );
            accountsDto.push(new AccountResponseDTO({ ...account, balance }));
        }
        return accountsDto;
    }

    async updateCredit(accountId: number, credit: number) {
        const account = await this.accountRepository.findById(accountId);
        if (!account) {
            throw new Error('A conta não foi encontrada!');
        }
        const balance = await new TransactionService().getAccountBalance(
            account.id
        );
        if (credit < Number(account.credit)) {
            throw new Error(
                'O crédito não pode ser menor que o crédito atual!'
            );
        }

        const updatedAccount = await this.accountRepository.update(accountId, {
            credit
        });
        return new AccountResponseDTO({ ...updatedAccount, balance });
    }
}
