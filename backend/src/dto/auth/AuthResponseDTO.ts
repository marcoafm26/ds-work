import { FieldValidators } from '../../utils/FieldValidators';
import { Validatable, ValidationResult } from './../../interface/Validatable';

export class AuthResponseDTO implements Validatable {
    private _token: string;

    constructor(data: { token: string }) {
        this._token = data.token;
    }

    get token(): string {
        return this._token;
    }

    validate(): ValidationResult {
        const errors: string[] = [];
        const tokenError = FieldValidators.validateToken(this._token);
        if (tokenError) errors.push(tokenError);

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
