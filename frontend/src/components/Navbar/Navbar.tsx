import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getClient from '../../utils/getClient';
import Button from '../utils/Button/Button';
import './Navbar.scss';

interface NavbarProps {
    name?: string;
}

const Navbar = ({ name }: NavbarProps) => {
    const navigate = useNavigate();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const client = getClient();

    useEffect(() => {
        handleFindAccounts();
    }, []);
    const handleLogout = async () => {
        try {
            await fetch('/api/logout', {
                method: 'GET',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            localStorage.removeItem('client');
            navigate('/login');
        }
    };

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
        const totalBalance = result.data.reduce(
            (acc: number, account: { balance: number }) =>
                acc + account.balance,
            0
        );
        setTotalAmount(totalBalance);
    };

    return (
        <div className="navbar">
            <div className="navbar__content">
                <div className="navbar__left">
                    <img
                        src="/bank-logo.png"
                        alt=""
                        onClick={() => navigate('/dashboard')}
                        style={{ cursor: 'pointer' }}
                    />
                    <h2>Saldo total: {totalAmount}</h2>
                </div>
                <div className="navbar__right">
                    <h2>{name}</h2>
                    <Button variant="primary" onClick={() => handleLogout()}>
                        Sair
                    </Button>
                </div>
            </div>
            <div className="navbar__divider"></div>
        </div>
    );
};

export default Navbar;
