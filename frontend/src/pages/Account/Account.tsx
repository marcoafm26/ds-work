import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Navbar from '../../components/Navbar/Navbar';
import Button from '../../components/utils/Button/Button';
import getClient from '../../utils/getClient';
import './Account.scss';

interface Account {
    id: number;
    number: string;
    balance: number;
}

const Account = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const client = getClient();

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

    return (
        <div className="account" data-size="large">
            <Navbar name={client?.name} />
            <Header name="Contas" />

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
        </div>
    );
};

export default Account;
