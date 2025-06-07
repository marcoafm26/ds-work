import { z } from 'zod';

const depositSchema = z.object({
    account: z.string().min(1, 'É obrigatório escolher uma conta'),
    amount: z
        .number({ invalid_type_error: 'Digite um valor numerico' })
        .positive('O valor deve ser positivo')
});

export { depositSchema };
export type DepositSchema = z.infer<typeof depositSchema>;
