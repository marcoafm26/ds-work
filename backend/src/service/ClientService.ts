import { ClientRequestDTO } from '../dto/client/ClientRequestDTO';
import { ClientResponseDTO } from '../dto/client/ClientResponseDTO';
import { ClientRepository } from '../repository/ClientRepository';
import { hashPassword } from '../utils/bycript';

export class ClientService {
    private clientRepository: ClientRepository;

    constructor() {
        this.clientRepository = new ClientRepository();
    }

    async create(client: ClientRequestDTO) {
        // Validação de negócio
        const cpfAlreadyExists = await this.clientRepository.findByCpf(
            client.cpf
        );
        if (cpfAlreadyExists) {
            throw new Error('O CPF já existe!');
        }

        const hashedPassword = await hashPassword(client.password);
        const clientData = {
            ...client.toPrismaData(),
            password: hashedPassword
        };

        return new ClientResponseDTO(
            await this.clientRepository.create(clientData)
        );
    }

    async delete(id: number) {
        return new ClientResponseDTO(await this.clientRepository.delete(id));
    }

    async findById(id: number) {
        const client = await this.clientRepository.findById(id);
        if (!client) {
            throw new Error('O id não foi encontrado!');
        }
        return new ClientResponseDTO(client);
    }

    async findByCpf(cpf: string) {
        const client = await this.clientRepository.findByCpf(cpf);
        if (!client) {
            throw new Error('O CPF não foi encontrado!');
        }

        return new ClientResponseDTO(client);
    }
}
