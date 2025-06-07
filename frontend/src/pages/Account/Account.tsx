import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import Label from '../../components/Label/Label';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/utils/Button/Button';
import Input from '../../components/utils/Input/Input';
import getClient from '../../utils/getClient';
import './Account.scss';
import { accountSchema, type AccountSchema } from './AccountSchema';

interface Account {
    id: number;
    number: string;
    balance: number;
    credit: number;
}

const Account = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const client = getClient();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<AccountSchema>({
        resolver: zodResolver(accountSchema)
    });
    // Mock data - substituir por chamada real da API
    useEffect(() => {
        handleFindAccounts();
    }, []);

    const handleFindAccounts = async () => {
        if (!client?.id) return;
        const response = await fetch(`/api/accounts/${client?.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const result = await response.json();
        setAccounts(result.data);
    };

    const handleCreateAccount = async () => {
        setLoading(true);
        console.log(client?.id);
        await fetch('/api/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                clientId: client?.id
            })
        });
        handleFindAccounts();
        setLoading(false);
    };

    const handleChangeCredit = async (data: AccountSchema) => {
        setError(null);
        setLoading(true);
        const accountId = parseInt(data.account);
        const account = accounts.find((account) => account.id === accountId);

        if (!account) {
            setError('Conta não encontrada');
            setLoading(false);
            return;
        }
        const response = await fetch(`/api/account/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                accountId,
                credit: data.credit
            })
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
            const errorMessages = result.errors || [
                'Erro ao atualizar o credito'
            ];
            setError(errorMessages.join(', '));
            setLoading(false);
            return;
        }

        handleFindAccounts();
        setLoading(false);
    };

    return (
        <div className="account" data-size="large">
            <Navbar name={client?.name} />
            <Header name="Contas" />
            {error && <div className="error-message">{error}</div>}

            <table className="accounts-table">
                <thead>
                    <tr>
                        <th>Número da Conta</th>
                        <th>Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.length > 0 &&
                        accounts.map((account) => (
                            <tr key={account.id}>
                                <td>{account.number}</td>
                                <td>R$ {account.balance.toFixed(2)}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {!accounts.length && <h2>Nenhuma conta foi encontrada!</h2>}
            <div className="button-area">
                <Button
                    variant="primary"
                    disabled={loading}
                    onClick={() => handleCreateAccount()}
                >
                    Criar nova conta
                </Button>
            </div>

            <form onSubmit={handleSubmit(handleChangeCredit)}>
                <div className="field-group">
                    <Label htmlFor="account">Contas</Label>
                    <select id="account" {...register('account')}>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.number} - R${' '}
                                {account.balance.toFixed(2)}
                                {' - '}
                                {account.credit} Crédito
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field-group">
                    <Label htmlFor="credit">Valor</Label>
                    <Input
                        id="credit"
                        type="number"
                        step="0.01"
                        {...register('credit', { valueAsNumber: true })}
                        className={errors.credit ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.credit && (
                        <span className="error-message">
                            {errors.credit.message}
                        </span>
                    )}
                </div>

                <div className="button-area">
                    <Button type="submit" variant="primary" disabled={loading}>
                        Sacar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Account;
