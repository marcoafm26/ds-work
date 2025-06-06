export class FieldValidators {
    static validateCPF(cpf: string): string | null {
        if (!cpf || cpf.trim() === '') {
            return 'CPF é obrigatório';
        }

        if (!/^[0-9]{11}$/.test(cpf)) {
            return 'CPF deve conter exatamente 11 dígitos numéricos';
        }
        return null;
    }

    static validatePassword(password: string): string | null {
        if (!password || password.trim() === '') {
            return 'Senha é obrigatória';
        }

        if (password.length < 6) {
            return 'Senha deve ter pelo menos 6 caracteres';
        }
        return null;
    }

    static validateName(name: string): string | null {
        console.log(name);
        if (!name || name.trim() === '') {
            return 'Nome é obrigatório';
        }

        if (name.trim().length < 2) {
            return 'Nome deve ter pelo menos 2 caracteres';
        }
        return null;
    }

    static validatePhone(phone: string): string | null {
        if (!phone || phone.trim() === '') {
            return 'Telefone é obrigatório';
        }

        if (!/^\d{11}$/.test(phone)) {
            return 'Telefone deve conter exatamente 11 dígitos';
        }
        return null;
    }

    static validateToken(token: string): string | null {
        if (!token || token.trim() === '') {
            return 'Token é obrigatório';
        }
        if (token.trim().length < 6) {
            return 'Token deve ter pelo menos 6 caracteres';
        }
        return null;
    }
}
