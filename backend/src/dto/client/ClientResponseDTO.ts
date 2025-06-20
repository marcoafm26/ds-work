export class ClientResponseDTO {
    private _id: number;
    private _name: string;
    private _cpf: string;
    private _phone: string;

    constructor(data: {
        id: number;
        name: string;
        cpf: string;
        phone: string;
    }) {
        this._id = data.id;
        this._name = data.name;
        this._cpf = data.cpf;
        this._phone = data.phone;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get phone(): string {
        return this._phone;
    }

    toPrismaData() {
        return {
            id: this._id,
            name: this._name,
            cpf: this._cpf,
            phone: this._phone
        };
    }
}
