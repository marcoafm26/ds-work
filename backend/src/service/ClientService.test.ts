import { ClientRequestDTO } from '../dto/client/ClientRequestDTO';
import { addCleanup, runCleanups } from '../utils/test';
import { ClientService } from './ClientService';

const cleanups: Array<() => Promise<void>> = [];
afterEach(async () => {
    await runCleanups();
});

describe('ClientService', () => {
    it('should create a client', async () => {
        const clientService = new ClientService();
        const clientDto = new ClientRequestDTO({
            name: 'John Martin',
            cpf: '123456784',
            phone: '123456789',
            password: '123456789'
        });
        const client = await clientService.create(clientDto);
        expect(client).toBeTruthy();

        // Adiciona a função de limpeza
        addCleanup(async () => {
            await clientService.delete(client.id);
        });
    });
});
