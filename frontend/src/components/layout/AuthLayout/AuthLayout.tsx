import { Outlet } from 'react-router-dom';
import './AuthLayout.scss';

interface AuthLayoutProps {
    id?: string;
}

const AuthLayout = ({ id }: AuthLayoutProps) => {
    return (
        <div id={id} className="auth-layout">
            <Outlet />
        </div>
    );
};

export default AuthLayout;
