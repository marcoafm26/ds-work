import { ClientRequestDTO } from '../src/dto/client/ClientRequestDTO';
import { ClientService } from './../src/service/ClientService';

// const prisma = new PrismaClient();

async function createUser() {
    try {
        // const hashedPassword = await hashPassword('123456');

        const userDto = new ClientRequestDTO({
            name: 'João Silva',
            cpf: '12345678901',
            phone: '11999999999',
            password: 'marco123'
        });
        const user = await new ClientService().create(userDto);

        console.log('✅ Usuário criado com sucesso:');
        console.log('CPF:', userDto.cpf);
        console.log('Nome:', userDto.name);
        console.log('Senha: marco123');
    } catch (error) {
        console.error('❌ Erro ao criar usuário:', error);
    } finally {
        // await prisma.$disconnect();
    }
}

createUser();
