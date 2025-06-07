import { Decimal } from '@prisma/client/runtime/library';
import { FieldValidators } from '../../utils/FieldValidators';
import { Validatable, ValidationResult } from './../../interface/Validatable';
export class AccountResponseDTO implements Validatable {
    _id: number;
    _number: string;
    _clientId: number;
    _balance: number;
    _credit?: number;

    constructor(data: {
        id: number;
        number: string;
        clientId: number;
        balance: number;
        credit?: number | Decimal;
    }) {
        this._id = data.id;
        this._number = data.number;
        this._clientId = data.clientId;
        this._balance = data.balance;
        this._credit = Number(data.credit || 0);
    }

    get id(): number {
        return this._id;
    }
    get number(): string {
        return this._number;
    }
    get balance(): number {
        return this._balance;
    }

    set balance(value: number) {
        this._balance = value;
    }

    get clientId(): number {
        return this._clientId;
    }

    get credit() {
        return this._credit;
    }

    validate(): ValidationResult {
        const balanceError = FieldValidators.validateBalance(this._balance);

        return {
            isValid: !balanceError,
            errors: balanceError ? [balanceError] : []
        };
    }

    toPrismaData(): any {
        return {
            id: this._id,
            number: this._number,
            clientId: this._clientId,
            balance: this._balance,
            credit: this._credit
        };
    }
}
