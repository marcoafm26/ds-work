import { z } from 'zod';

const transferenceSchema = z
    .object({
        account: z.string().min(1, 'É obrigatório escolher uma conta'),
        targetAccount: z.string().min(1, 'É obrigatório escolher uma conta'),
        amount: z
            .number({ invalid_type_error: 'Digite um valor numerico' })
            .positive('O valor deve ser positivo')
    })
    .refine((data) => data.account !== data.targetAccount, {
        message: 'As contas são iguais!',
        path: ['targetAccount']
    });

export { transferenceSchema };
export type TransferenceSchema = z.infer<typeof transferenceSchema>;
