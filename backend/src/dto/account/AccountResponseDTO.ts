import { FieldValidators } from '../../utils/FieldValidators';
import { Validatable, ValidationResult } from './../../interface/Validatable';
export class AccountResponseDTO implements Validatable {
    _id: number;
    _number: string;
    _client: number;
    _balance: number;

    constructor(data: {
        id: number;
        number: string;
        clientId: number;
        balance: number;
    }) {
        this._id = data.id;
        this._number = data.number;
        this._client = data.clientId;
        this._balance = data.balance;
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

    get client(): number {
        return this._client;
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
            clientId: this._client,
            balance: this._balance
        };
    }
}
