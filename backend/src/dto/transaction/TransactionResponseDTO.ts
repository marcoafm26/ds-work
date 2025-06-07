import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { FieldValidators } from '../../utils/FieldValidators';
import { Validatable, ValidationResult } from './../../interface/Validatable';

export class TransactionResponseDTO implements Validatable {
    _id: number;
    _amount: number;
    _type: TransactionType;
    _accountId: number;
    _createdAt: Date;
    _transference?: number;

    constructor(data: {
        id: number;
        amount: Decimal;
        type: TransactionType;
        accountId: number;
        createdAt: Date;
        transference?: number;
    }) {
        this._id = data.id;
        this._amount = Number(data.amount);
        this._type =
            data.type === 'CREDIT'
                ? TransactionType.CREDIT
                : TransactionType.DEBIT;
        this._accountId = data.accountId;
        this._createdAt = data.createdAt;
        this._transference = data.transference;
    }

    get id(): number {
        return this._id;
    }

    get amount(): number {
        return this._amount;
    }

    get type(): TransactionType {
        return this._type;
    }

    get accountId(): number {
        return this._accountId;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    validate(): ValidationResult {
        const errors: string[] = [];

        const amountError = FieldValidators.validateTransactionAmount(
            this._amount
        );
        if (amountError) errors.push(amountError);

        const typeError = FieldValidators.validateTransactionType(this._type);
        if (typeError) errors.push(typeError);

        const accountIdError = FieldValidators.validateAccountId(
            this._accountId
        );
        if (accountIdError) errors.push(accountIdError);

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toPrismaData(): any {
        return {
            id: this._id,
            amount: this.getFormattedAmount(),
            type: this.getTypeDescription(),
            accountId: this._accountId,
            createdAt: this.getFormattedDate(),
            transference: this.getTransference()
        };
    }

    // Método para formatação brasileira do valor
    getFormattedAmount(): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(this._amount);
    }

    // Método para formatação brasileira da data
    getFormattedDate(): string {
        return this._createdAt.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Método para descrição amigável do tipo
    getTypeDescription(): string {
        return this._type === TransactionType.CREDIT ? 'Crédito' : 'Débito';
    }

    getTransference(): string {
        if (this._transference) {
            return 'Transferência';
        }

        return this._type === TransactionType.CREDIT ? 'Depósito' : 'Saque';
    }
}
