import { z } from 'zod';

const statementSchema = z.object({
    account: z.string().min(1, 'É obrigatório escolher uma conta')
});

export { statementSchema };
export type StatementSchema = z.infer<typeof statementSchema>;