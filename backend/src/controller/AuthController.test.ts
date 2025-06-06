import { Request, Response } from 'express';
import { ClientRequestDTO } from '../dto/client/ClientRequestDTO';
import { ClientService } from '../service/ClientService';
import { addCleanup, runCleanups } from '../utils/test';
import { AuthController } from './AuthController';

describe('AuthController', () => {
    let authController: AuthController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let clientService = new ClientService();
    let responseData: any;
    let statusCode: number;
    let cookieData: any;

    beforeEach(() => {
        authController = new AuthController();
        responseData = null;
        statusCode = 0;
        cookieData = null;

        mockResponse = {
            status: jest.fn().mockImplementation((code) => {
                statusCode = code;
                return mockResponse;
            }),
            json: jest.fn().mockImplementation((data) => {
                responseData = data;
                return mockResponse;
            }),
            cookie: jest.fn().mockImplementation((name, value) => {
                cookieData = { name, value };
                return mockResponse;
            })
        };
    });

    afterEach(async () => {
        await runCleanups();
    });

    describe('login', () => {
        it('should handle login request successfully with valid credentials', async () => {
            // Preparar dados de teste
            const testUser = {
                name: 'João da Silva Teste',
                cpf: '12345678901',
                phone: '11987654321',
                password: 'senha123'
            };

            const clientDto = new ClientRequestDTO(testUser);
            // Criar cliente no banco
            const createdClient = await clientService.create(clientDto);
            // Adicionar limpeza
            addCleanup(async () => {
                await new ClientService().delete(createdClient.id);
            });

            // Preparar request
            mockRequest = {
                body: {
                    cpf: '12345678901',
                    password: 'senha123'
                }
            };

            // Executar login
            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            // Verificações
            // expect(statusCode).toBe(200);
            // expect(responseData).toEqual({
            //     success: true,
            //     data: expect.objectContaining(createdClient)
            // });

            // expect(responseData.data).toHaveProperty('token');
            expect(cookieData).toEqual({
                name: 'token',
                value: expect.any(String)
            });
        });

        it('should handle login request with invalid credentials', async () => {
            // Preparar dados de teste
            const testUser = {
                name: 'Maria da Silva Teste',
                cpf: '98765432109',
                phone: '11987654321',
                password: 'senhaCorreta123'
            };

            const clientDto = new ClientRequestDTO(testUser);
            // Criar cliente no banco usando ClientService
            const createdClient = await clientService.create(clientDto);

            // Adicionar limpeza
            addCleanup(async () => {
                await new ClientService().delete(createdClient.id);
            });

            // Preparar request com senha incorreta
            mockRequest = {
                body: {
                    cpf: '98765432109',
                    password: 'senhaIncorreta'
                }
            };

            // Executar login
            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            // Verificações
            expect(statusCode).toBe(400);
            expect(responseData).toEqual({
                success: false,
                errors: ['Senha incorreta!']
            });
            expect(cookieData).toBeNull();
        });

        it('should handle login request with non-existent CPF', async () => {
            // Preparar request com CPF que não existe
            mockRequest = {
                body: {
                    cpf: '11111111111',
                    password: 'qualquerSenha'
                }
            };

            // Executar login
            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            // Verificações
            expect(statusCode).toBe(400);
            expect(responseData).toEqual({
                success: false,
                errors: ['Não foi encontrado um cliente com esse CPF!']
            });
            expect(cookieData).toBeNull();
        });

        it('should handle login request with invalid data format', async () => {
            // Preparar request com dados inválidos
            mockRequest = {
                body: {
                    cpf: '123', // CPF inválido
                    password: '12' // Senha muito curta
                }
            };

            // Executar login
            await authController.login(
                mockRequest as Request,
                mockResponse as Response
            );

            // Verificações
            expect(statusCode).toBe(400);
            expect(responseData.success).toBe(false);
            expect(responseData.errors).toContain(
                'CPF deve conter exatamente 11 dígitos numéricos'
            );
            expect(responseData.errors).toContain(
                'Senha deve ter pelo menos 6 caracteres'
            );
            expect(cookieData).toBeNull();
        });
    });
});
