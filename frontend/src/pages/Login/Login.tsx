import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Label from '../../components/Label/Label';
import Button from '../../components/utils/Button/Button';
import Input from '../../components/utils/Input/Input';
import './Login.scss';

const loginSchema = z.object({
    cpf: z.string().min(11, 'CPF inválido'),
    password: z.string().min(6, 'Senha inválida')
});

type LoginSchema = z.infer<typeof loginSchema>;
const Login = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    });

    const handleLogin = (data: unknown) => {
        setLoading(true);
        console.log(data);
    };

    return (
        <div className="login" data-size="small">
            <img src="/bank-logo.png" alt="Bank Logo" />
            <form onSubmit={handleSubmit(handleLogin)}>
                <Label htmlFor="#cpf">CPF</Label>
                <Input type="text" mask="cpf" {...register('cpf')} />
                <Label htmlFor="#password">Senha</Label>
                <Input type="password" {...register('password')} />
                <div className="button-area">
                    <Button variant="secondary">Cadastrar</Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        Entrar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
