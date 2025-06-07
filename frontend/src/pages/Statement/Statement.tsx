import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../components/Header/Header';
import Label from '../../components/Label/Label';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/utils/Button/Button';
import getClient from '../../utils/getClient';
import './Statement.scss';
import { statementSchema, type StatementSchema } from './StatementSchema';

interface Account {
    id: number;
    number: string;
    balance: number;
}

interface Transaction {
    createdAt: string;
    amount: number;
    type: string;
    accountId: number;
}

const Statement = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const [loading, setLoading] = useState(false);
    const client = getClient();

    const {
        register,
        handleSubmit
        // formState: { errors }
    } = useForm<StatementSchema>({
        resolver: zodResolver(statementSchema)
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

    const handleFindTransactions = async (data: StatementSchema) => {
        setLoading(true);
        setTransactions([]);

        const response = await fetch(`/api/transactions/${data.account}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const result = await response.json();
        setTransactions(result.data);
        setLoading(false);
    };

    return (
        <div className="statement" data-size="large">
            <Navbar name={client?.name} />
            <Header name="Contas" />
            <form onSubmit={handleSubmit(handleFindTransactions)}>
                {/* {error && <div className="error-message">{error}</div>} */}
                <div className="field-group">
                    <Label htmlFor="account">Contas</Label>
                    <select id="account" {...register('account')}>
                        {accounts.map((account) => (
                            <option key={account.number} value={account.id}>
                                {account.number} - R${' '}
                                {account.balance.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="button-area">
                    <Button type="submit" variant="primary" disabled={loading}>
                        Buscar transações
                    </Button>
                </div>
            </form>
            {transactions.length > 0 && (
                <table className="accounts-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Tipo</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.createdAt}</td>
                                <td>{transaction.type}</td>
                                <td>R$ {transaction.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {!accounts.length && <h2>Nenhum extrato foi encontrada!</h2>}
        </div>
    );
};

export default Statement;
