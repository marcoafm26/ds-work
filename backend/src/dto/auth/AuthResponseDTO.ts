import { ClientResponseDTO } from '../client/ClientResponseDTO';

export class AuthResponseDTO extends ClientResponseDTO {
    private _token: string;

    constructor(data: {
        id: number;
        name: string;
        cpf: string;
        phone: string;
        password: string;
        token: string;
    }) {
        super(data);
        this._token = data.token;
    }

    get token(): string {
        return this._token;
    }

    validate(): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];
        if (!this.token || this.token.length === 0) {
            errors.push('Token é obrigatório');
        }
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}
