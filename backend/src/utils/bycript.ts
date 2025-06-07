import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
    // Hash da senha
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    // Compara a senha fornecida com a senha hash armazenada
    return await bcrypt.compare(password, hashedPassword);
};
