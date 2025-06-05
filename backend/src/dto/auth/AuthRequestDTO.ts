import { Validatable, ValidationResult } from '../../interface/Validatable';
import { FieldValidators } from '../../utils/FieldValidators';

export class AuthRequestDTO implements Validatable {
    cpf: string;
    password: string;

    constructor(data: any) {
        this.cpf = data.cpf;
        this.password = data.password;
    }

    validate(): ValidationResult {
        const errors: string[] = [];

        const cpfError = FieldValidators.validateCPF(this.cpf);
        if (cpfError) errors.push(cpfError);

        const passwordError = FieldValidators.validatePassword(this.password);
        if (passwordError) errors.push(passwordError);

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
