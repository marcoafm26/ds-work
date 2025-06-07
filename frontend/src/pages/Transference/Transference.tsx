import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import Label from '../../components/Label/Label';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/utils/Button/Button';
import Input from '../../components/utils/Input/Input';
import getClient from '../../utils/getClient';
import './Transference.scss';
import {
    type TransferenceSchema,
    transferenceSchema
} from './TransferenceSchema';

interface AccountData {
    id: string;
    number: string;
    balance: number;
    createdAt: string;
    transference?: number;
}

export default function Transference() {
    const [accounts, setAccounts] = useState<AccountData[]>([]);
    const [targetAccounts, setTargetAccounts] = useState<AccountData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const client = getClient();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TransferenceSchema>({
        resolver: zodResolver(transferenceSchema)
    });

    useEffect(() => {
        handleFindAccounts();
        handleFindAllAccounts();
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
        console.log(result);
        setAccounts(result.data);
        setTargetAccounts(result.data);
    };

    const handleFindAllAccounts = async () => {
        if (!client?.id) return;
        const response = await fetch(`/api/accounts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const result = await response.json();
        console.log(result);
        setTargetAccounts(result.data);
    };

    const handleTransference = async (data: TransferenceSchema) => {
        console.log(data);
        setLoading(true);
        setError(null);

        try {
            const accountId = data.account;
            const targetAccountId = data.targetAccount;
            const amount = data.amount;

            // Primeira transação - débito da conta origem
            const response = await fetch('/api/transaction/transference', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accountId,
                    targetAccountId,
                    amount
                }),
                credentials: 'include'
            });

            const result = await response.json();
            if (!response.ok || !result.success) {
                const errorMessages = result.errors || [
                    'Erro ao realizar transferência'
                ];
                setError(errorMessages.join(', '));
                setLoading(false);
                return;
            }
            console.log(result);

            handleFindAccounts();
            handleFindAllAccounts();
            setLoading(false);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            setLoading(false);
        }
    };

    return (
        <div className="transference">
            <Navbar name={client?.name} />
            <Header name="Transferência" />
            <form onSubmit={handleSubmit(handleTransference)}>
                {error && <div className="error-message">{error}</div>}
                <div className="field-group">
                    <Label htmlFor="account">Conta de Origem</Label>
                    <select id="account" {...register('account')}>
                        <option value="">Selecione uma conta</option>
                        {accounts.map((account) => (
                            <option key={account.id} value={account.id}>
                                {account.number} - R${' '}
                                {account.balance.toFixed(2)}
                            </option>
                        ))}
                    </select>
                    {errors.account && (
                        <span className="error-message">
                            {errors.account.message}
                        </span>
                    )}
                </div>

                <div className="field-group">
                    <Label htmlFor="targetAccount">Conta de Destino</Label>
                    <select id="targetAccount" {...register('targetAccount')}>
                        <option value="">Selecione uma conta</option>
                        {targetAccounts.map((targetAccount) => (
                            <option
                                key={targetAccount.id}
                                value={targetAccount.id}
                            >
                                {targetAccount.number} - R${' '}
                                {targetAccount.balance.toFixed(2)}
                            </option>
                        ))}
                    </select>
                    {errors.targetAccount && (
                        <span className="error-message">
                            {errors.targetAccount.message}
                        </span>
                    )}
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
                        {loading ? 'Transferindo...' : 'Transferir'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
