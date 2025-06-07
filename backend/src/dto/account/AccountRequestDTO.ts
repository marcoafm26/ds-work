import { FieldValidators } from '../../utils/FieldValidators';
import { Validatable, ValidationResult } from './../../interface/Validatable';
export class AccountRequestDTO implements Validatable {
    _id: number;
    _number: string;
    _clientId: number;

    constructor(data: { id: number; number: string; clientId: number }) {
        this._id = data.id;
        this._number = data.number;
        this._clientId = data.clientId;
    }

    get id(): number {
        return this._id;
    }
    get number(): string {
        return this._number;
    }
    get clientId(): number {
        return this._clientId;
    }

    validate(): ValidationResult {
        const numberError = FieldValidators.validateAccountNumber(this.number);

        return {
            isValid: !numberError,
            errors: numberError ? [numberError] : []
        };
    }
}
