import { TransactionType } from '@prisma/client';
import { FieldValidators } from '../../utils/FieldValidators';
import { Validatable, ValidationResult } from './../../interface/Validatable';

export class TransactionRequestDTO implements Validatable {
    _amount: number;
    _type: TransactionType;
    _accountId: number;
    _transference?: number;

    constructor(data: {
        amount: number;
        type: TransactionType;
        accountId: number;
        transference?: number;
    }) {
        this._amount = data.amount;
        this._type =
            data.type === 'CREDIT'
                ? TransactionType.CREDIT
                : TransactionType.DEBIT;
        this._accountId = data.accountId;
        this._transference = data.transference;
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

    get transference(): number {
        return this._transference || 0;
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
            amount: this._amount,
            type: this._type,
            accountId: this._accountId,
            transference: this._transference || 0
        };
    }
}
