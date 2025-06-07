import { Validatable, ValidationResult } from '../../interface/Validatable';
import { FieldValidators } from '../../utils/FieldValidators';

export class ClientRequestDTO implements Validatable {
    private _id?: number;
    private _name: string;
    private _cpf: string;
    private _phone: string;
    private _password: string;

    constructor(data: {
        id?: number;
        name: string;
        cpf: string;
        phone: string;
        password: string;
    }) {
        this._id = data.id;
        this._name = data.name;
        this._cpf = data.cpf;
        this._phone = data.phone;
        this._password = data.password;
    }

    get id(): number | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get cpf(): string {
        return this._cpf;
    }

    get phone(): string {
        return this._phone;
    }

    get password(): string {
        return this._password;
    }

    validate(): ValidationResult {
        const errors: string[] = [];

        const nameError = FieldValidators.validateName(this.name);
        if (nameError) errors.push(nameError);

        const cpfError = FieldValidators.validateCPF(this.cpf);
        if (cpfError) errors.push(cpfError);

        const phoneError = FieldValidators.validatePhone(this.phone);
        if (phoneError) errors.push(phoneError);

        const passwordError = FieldValidators.validatePassword(this.password);
        if (passwordError) errors.push(passwordError);

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    toPrismaData() {
        return {
            name: this.name,
            cpf: this.cpf,
            phone: this.phone,
            password: this.password
        };
    }
}
