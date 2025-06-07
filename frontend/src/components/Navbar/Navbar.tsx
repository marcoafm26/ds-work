import { useNavigate } from 'react-router-dom';
import Button from '../utils/Button/Button';
import './Navbar.scss';

interface NavbarProps {
    name?: string;
}

const Navbar = ({ name }: NavbarProps) => {
    const navigate = useNavigate();
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
    return (
        <div className="navbar">
            <div className="navbar__content">
                <img
                    src="/bank-logo.png"
                    alt=""
                    onClick={() => navigate('/dashboard')}
                />
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
