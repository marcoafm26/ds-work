import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import Label from '../../components/Label/Label';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/utils/Button/Button';
import Input from '../../components/utils/Input/Input';
import getClient from '../../utils/getClient';
import './Deposit.scss';
import { depositSchema, type DepositSchema } from './DepositSchema';

export interface Account {
    id: string;
    number: string;
    balance: number;
    createdAt: string;
}

const Deposit = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const client = getClient();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<DepositSchema>({
        resolver: zodResolver(depositSchema)
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

    const handleDeposit = async (data: DepositSchema) => {
        console.log(data);
        setLoading(true);
        const type = 'CREDIT';
        const amount = data.amount;
        const accountId = data.account;

        // console.log(accounts, data.account);
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
            setLoading(false);
            return;
        }
        handleFindAccounts();
        setLoading(false);
    };
    return (
        <div className="deposit">
            <Navbar name={client?.name} />
            <Header name="Depósitos" />
            <form onSubmit={handleSubmit(handleDeposit)}>
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
                        Depositar
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Deposit;
