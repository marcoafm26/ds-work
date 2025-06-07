import { AuthRequestDTO } from '../dto/auth/AuthRequestDTO';
import { AuthResponseDTO } from '../dto/auth/AuthResponseDTO';
import { ClientResponseDTO } from '../dto/client/ClientResponseDTO';
import { comparePassword } from '../utils/bycript';
import { generateToken } from '../utils/jwt';
import { ClientRepository } from './../repository/ClientRepository';

export class AuthService {
    private clientRepository: ClientRepository;
    constructor() {
        this.clientRepository = new ClientRepository();
    }

    async login(authDto: AuthRequestDTO) {
        const client = await this.clientRepository.findByCpf(authDto.cpf);
        if (!client) {
            throw new Error('Não foi encontrado um cliente com esse CPF!');
        }

        const isSamePassword = await comparePassword(
            authDto.password,
            client.password
        );

        if (!isSamePassword) {
            throw new Error('Senha incorreta!');
        }

        const token = generateToken(
            new ClientResponseDTO(client).toPrismaData()
        );
        return new AuthResponseDTO({ ...client, token }).toPrismaData();
    }
}
