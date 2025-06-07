import { z } from 'zod';

const withdrawSchema = z.object({
    account: z.string().min(1, 'É obrigatório escolher uma conta'),
    amount: z
        .number({ invalid_type_error: 'Digite um valor numerico' })
        .positive('O valor deve ser positivo')
});

export { withdrawSchema };
export type WithdrawSchema = z.infer<typeof withdrawSchema>;