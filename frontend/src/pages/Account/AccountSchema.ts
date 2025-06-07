import { z } from 'zod';

const accountSchema = z.object({
    account: z.string().min(1, 'É obrigatório escolher uma conta'),
    credit: z
        .number({ invalid_type_error: 'Digite um valor numerico' })
        .positive('O valor deve ser positivo')
});

export { accountSchema };
export type AccountSchema = z.infer<typeof accountSchema>;
