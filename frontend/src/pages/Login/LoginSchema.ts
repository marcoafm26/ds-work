import { z } from 'zod';

const loginSchema = z.object({
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
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
});

export { loginSchema };
export type LoginSchema = z.infer<typeof loginSchema>;
