import { FieldValidators } from '../../utils/FieldValidators';
import { Validatable, ValidationResult } from './../../interface/Validatable';
import { ClientResponseDTO } from './../client/ClientResponseDTO';

export class AuthResponseDTO implements Validatable {
    private _token: string;
    private _client: ClientResponseDTO;

    constructor(data: {
        token: string;
        id: number;
        name: string;
        cpf: string;
        phone: string;
    }) {
        this._token = data.token;
        this._client = new ClientResponseDTO(data);
    }

    get token(): string {
        return this._token;
    }

    get user() {
        return this._client;
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

    toPrismaData() {
        return {
            token: this._token,
            client: this._client.toPrismaData()
        };
    }
}
