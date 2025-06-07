import { FieldValidators } from '../../utils/FieldValidators';
import { Validatable, ValidationResult } from './../../interface/Validatable';

export enum TransactionType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT'
}

export class TransactionRequestDTO implements Validatable {
    _amount: number;
    _type: TransactionType;
    _accountId: number;

    constructor(data: { amount: number; type: TransactionType; accountId: number }) {
        this._amount = data.amount;
        this._type = data.type;
        this._accountId = data.accountId;
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

    validate(): ValidationResult {
        const errors: string[] = [];

        const amountError = FieldValidators.validateTransactionAmount(this._amount);
        if (amountError) errors.push(amountError);

        const typeError = FieldValidators.validateTransactionType(this._type);
        if (typeError) errors.push(typeError);

        const accountIdError = FieldValidators.validateAccountId(this._accountId);
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
            accountId: this._accountId
        };
    }
}