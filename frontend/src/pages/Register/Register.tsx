import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Label from '../../components/Label/Label';
import Button from '../../components/utils/Button/Button';
import Input from '../../components/utils/Input/Input';
import './Register.scss';
import { registerSchema, type RegisterSchema } from './RegisterSchema';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors } // TODO: verificar isso aqui
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema)
    });

    const handleRegister = async (data: RegisterSchema) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                // Extrai as mensagens de erro do backend
                const errorMessages = result.errors || ['Erro desconhecido'];
                setError(errorMessages.join(', '));
                setLoading(false);
                return;
            }

            setLoading(false);
            navigate('/login');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro de conexão');
            setLoading(false);
        }
    };

    return (
        <div className="register" data-size="small">
            <img src="/bank-logo.png" alt="Bank Logo" />
            <form onSubmit={handleSubmit(handleRegister)}>
                {error && <div className="error-message">{error}</div>}
                <div className="field-group">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                        id="name"
                        type="text"
                        {...register('name')}
                        className={errors.name ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.name && (
                        <span className="error-message">
                            {errors.name.message}
                        </span>
                    )}
                </div>
                <div className="field-group">
                    <Label htmlFor="cpf">Celular</Label>
                    <Input
                        id="phone"
                        type="text"
                        mask="phone"
                        {...register('phone')}
                        className={errors.phone ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.phone && (
                        <span className="error-message">
                            {errors.phone.message}
                        </span>
                    )}
                </div>
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

                <div className="field-group">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <Input
                        type="password"
                        {...register('confirmPassword')}
                        className={errors.confirmPassword ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.confirmPassword && (
                        <span className="error-message">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                <div className="button-area">
                    <Button type="submit" variant="primary" disabled={loading}>
                        Cadastrar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Register;
