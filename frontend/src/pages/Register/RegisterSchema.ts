import { z } from 'zod';

const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, 'O nome é obrigatório')
            .min(2, 'Nome deve ter pelo menos 2 caracteres'),
        phone: z
            .string()
            .min(1, 'O telefone é obrigatório')
            .transform((value) => value.replace(/\D/g, ''))
            .refine((value) => value.length === 11, {
                message: 'Telefone deve ter 11 dígitos'
            }),
        cpf: z
            .string()
            .min(1, 'O CPF é obrigatório')
            .transform((value) => value.replace(/\D/g, ''))
            .refine((value) => value.length === 11, {
                message: 'CPF deve ter 11 dígitos'
            }),
        password: z
            .string()
            .min(1, 'A senha é obrigatório')
            .min(6, 'Senha deve ter pelo menos 6 caracteres'),
        confirmPassword: z
            .string()
            .min(1, 'A confirmação de senha é obrigatório')
            .min(6, 'Senha deve ter pelo menos 6 caracteres')
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword']
    });

export { registerSchema };
export type RegisterSchema = z.infer<typeof registerSchema>;
