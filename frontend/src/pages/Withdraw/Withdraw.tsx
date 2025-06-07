import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import Label from '../../components/Label/Label';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/utils/Button/Button';
import Input from '../../components/utils/Input/Input';
import getClient from '../../utils/getClient';
import './Withdraw.scss';
import { withdrawSchema, type WithdrawSchema } from './WithdrawSchema';

export interface Account {
    id: string;
    number: string;
    balance: number;
    createdAt: string;
}

const Withdraw = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const client = getClient();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<WithdrawSchema>({
        resolver: zodResolver(withdrawSchema)
    });

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

    const handleWithdraw = async (data: WithdrawSchema) => {
        console.log(data);
        setLoading(true);
        setError(null);

        try {
            const type = 'DEBIT';
            const amount = data.amount;
            const accountId = data.account;

            const response = await fetch('/api/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accountId, type, amount }),
                credentials: 'include'
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                const errorMessages = result.errors || [
                    'Erro ao realizar saque'
                ];
                setError(errorMessages.join(', '));
                setLoading(false);
                return;
            }

            handleFindAccounts();
            setLoading(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            setLoading(false);
        }
    };

    return (
        <div className="withdraw">
            <Navbar name={client?.name} />
            <Header name="Saques" />
            <form onSubmit={handleSubmit(handleWithdraw)}>
                {error && <div className="error-message">{error}</div>}
                <div className="field-group">
                    <Label htmlFor="account">Contas</Label>
                    <select id="account" {...register('account')}>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.number} - R${' '}
                                {account.balance.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field-group">
                    <Label htmlFor="amount">Valor</Label>
                    <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        {...register('amount', { valueAsNumber: true })}
                        className={errors.amount ? 'error' : ''}
                        disabled={loading}
                    />
                    {errors.amount && (
                        <span className="error-message">
                            {errors.amount.message}
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

export default Withdraw;
