import { TransactionType } from '@prisma/client';

export class FieldValidators {
    static validateCPF(cpf: string): string | null {
        if (!cpf || cpf.trim() === '') {
            return 'CPF é obrigatório';
        }

        if (!/^[0-9]{11}$/.test(cpf)) {
            return 'CPF deve conter exatamente 11 dígitos numéricos';
        }
        return null;
    }

    static validatePassword(password: string): string | null {
        if (!password || password.trim() === '') {
            return 'Senha é obrigatória';
        }

        if (password.length < 6) {
            return 'Senha deve ter pelo menos 6 caracteres';
        }
        return null;
    }

    static validateName(name: string): string | null {
        if (!name || name.trim() === '') {
            return 'Nome é obrigatório';
        }

        if (name.trim().length < 2) {
            return 'Nome deve ter pelo menos 2 caracteres';
        }
        return null;
    }

    static validatePhone(phone: string): string | null {
        if (!phone || phone.trim() === '') {
            return 'Telefone é obrigatório';
        }

        if (!/^\d{11}$/.test(phone)) {
            return 'Telefone deve conter exatamente 11 dígitos';
        }
        return null;
    }

    static validateToken(token: string): string | null {
        if (!token || token.trim() === '') {
            return 'Token é obrigatório';
        }
        if (token.trim().length < 6) {
            return 'Token deve ter pelo menos 6 caracteres';
        }
        return null;
    }

    static validateBalance(balance: number): string | null {
        if (!balance) {
            return 'Saldo é obrigatório';
        }
        if (balance < 0) {
            return 'Saldo deve ser maior ou igual a 0';
        }
        return null;
    }

    static validateAccountNumber(accountNumber: string): string | null {
        if (!accountNumber || accountNumber.trim() === '') {
            return 'Número da conta é obrigatório';
        }
        if (accountNumber.trim().length < 9) {
            return 'Número da conta deve ter pelo menos 9 caracteres';
        }

        return null;
    }

    static validateTransactionAmount(amount: number): string | null {
        if (!amount || amount <= 0) {
            return 'Valor deve ser maior que zero';
        }

        if (amount > 999999.99) {
            return 'Valor não pode exceder R$ 999.999,99';
        }

        return null;
    }

    static validateTransactionType(type: TransactionType): string | null {
        if (!type || type.trim() === '') {
            return 'Tipo de transação é obrigatório';
        }

        const validTypes = ['CREDIT', 'DEBIT'];
        if (!validTypes.includes(type)) {
            return 'Tipo de transação inválido. Use CREDIT ou DEBIT';
        }

        return null;
    }

    static validateAccountId(accountId: number): string | null {
        if (!accountId || accountId <= 0) {
            return 'ID da conta é obrigatório e deve ser maior que zero';
        }

        return null;
    }
}
