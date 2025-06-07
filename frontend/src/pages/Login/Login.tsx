import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Label from '../../components/Label/Label';
import Button from '../../components/utils/Button/Button';
import Input from '../../components/utils/Input/Input';
import './Login.scss';
import { loginSchema, type LoginSchema } from './LoginSchema';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors } // TODO: verificar isso aqui
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    });

    const handleLogin = async (data: LoginSchema) => {
        setLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                credentials: 'include'
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                const errorMessages = result.errors || ['Erro desconhecido'];
                setError(errorMessages.join(', '));
                setLoading(false);
                return;
            }

            // Salvar dados do usuário no localStorage
            localStorage.setItem('client', JSON.stringify(result.user));

            navigate('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            setLoading(false);
        }
    };

    return (
        <div className="login" data-size="small">
            <img src="/bank-logo.png" alt="Bank Logo" />
            <form onSubmit={handleSubmit(handleLogin)}>
                {error && <div className="error-message">{error}</div>}
                <div className="field-group">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                        id="cpf"
                        type="text"
                        mask="cpf"
                        {...register('cpf')}
                        className={errors.cpf ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.cpf && (
                        <span className="error-message">
                            {errors.cpf.message}
                        </span>
                    )}
                </div>

                <div className="field-group">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        className={errors.password ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.password && (
                        <span className="error-message">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                <div className="button-area">
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/register')}
                    >
                        Cadastrar
                    </Button>
                    <Button type="submit" variant="primary" disabled={loading}>
                        Entrar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Login;
