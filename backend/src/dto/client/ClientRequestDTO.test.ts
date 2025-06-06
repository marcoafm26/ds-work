import { ClientRequestDTO } from './ClientRequestDTO';

describe('ClientRequestDTO', () => {
    describe('validate', () => {
        it('should return no errors for valid data', () => {
            const data = {
                name: 'John Silva',
                cpf: '12345678901',
                phone: '11987654321',
                password: 'password123'
            };

            const dto = new ClientRequestDTO(data);
            const validation = dto.validate();

            expect(validation.isValid).toBe(true);
            expect(validation.errors).toHaveLength(0);
        });

        it('should return error for invalid name', () => {
            const testCases = [
                { name: 'A', desc: 'empty name' },
                { name: 'A', desc: 'name with 1 character' }
            ];

            testCases.forEach(({ name, desc }) => {
                const data = {
                    name,
                    cpf: '12345678901',
                    phone: '119876543210',
                    password: 'password123'
                };

                const dto = new ClientRequestDTO(data);
                const validation = dto.validate();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain(
                    'Nome deve ter pelo menos 2 caracteres'
                );
            });
        });

        it('should return error for invalid CPF', () => {
            const testCases = [
                { cpf: '1234567890', desc: 'CPF with 10 digits' },
                { cpf: '123456789012', desc: 'CPF with 12 digits' },
                { cpf: '1234567890a', desc: 'CPF with letters' },
                { cpf: 'das', desc: 'empty CPF' }
            ];

            testCases.forEach(({ cpf, desc }) => {
                const data = {
                    name: 'John Silva',
                    cpf,
                    phone: '119876543210',
                    password: 'password123'
                };

                const dto = new ClientRequestDTO(data);
                const validation = dto.validate();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain(
                    'CPF deve conter exatamente 11 dígitos numéricos'
                );
            });
        });

        it('should return error for weak password', () => {
            const testCases = [
                { password: '12', desc: 'empty password' },
                { password: '12345', desc: 'password with 5 characters' }
            ];

            testCases.forEach(({ password, desc }) => {
                const data = {
                    name: 'John Silva',
                    cpf: '12345678901',
                    phone: '119876543210',
                    password
                };

                const dto = new ClientRequestDTO(data);
                const validation = dto.validate();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain(
                    'Senha deve ter pelo menos 6 caracteres'
                );
            });
        });

        it('should return error for invalid phone', () => {
            const testCases = [
                { phone: '1198765432', desc: 'phone with 10 digits' },
                { phone: '119876543212', desc: 'phone with 12 digits' },
                { phone: '11987654321012', desc: 'phone with 14 digits' },
                { phone: '119876543abc', desc: 'phone with letters' }
            ];

            testCases.forEach(({ phone, desc }) => {
                const data = {
                    name: 'John Silva',
                    cpf: '12345678901',
                    phone,
                    password: 'password123'
                };

                const dto = new ClientRequestDTO(data);
                const validation = dto.validate();

                expect(validation.isValid).toBe(false);
                expect(validation.errors).toContain(
                    'Telefone deve conter exatamente 11 dígitos'
                );
            });
        });

        it('should return multiple errors for multiple invalid fields', () => {
            const data = {
                name: 'A',
                cpf: '123',
                phone: '123',
                password: '123'
            };

            const dto = new ClientRequestDTO(data);
            const validation = dto.validate();

            expect(validation.isValid).toBe(false);
            expect(validation.errors).toContain(
                'Nome deve ter pelo menos 2 caracteres'
            );
            expect(validation.errors).toContain(
                'CPF deve conter exatamente 11 dígitos numéricos'
            );
            expect(validation.errors).toContain(
                'Senha deve ter pelo menos 6 caracteres'
            );
            expect(validation.errors).toContain(
                'Telefone deve conter exatamente 11 dígitos'
            );
        });
    });

    describe('toPrismaData', () => {
        it('should return correct prisma data', () => {
            const data = {
                name: 'John Silva',
                cpf: '12345678901',
                phone: '119876543210',
                password: 'password123'
            };

            const dto = new ClientRequestDTO(data);
            const prismData = dto.toPrismaData();

            expect(prismData).toEqual({
                name: 'John Silva',
                cpf: '12345678901',
                phone: '119876543210',
                password: 'password123'
            });
        });
    });
});
