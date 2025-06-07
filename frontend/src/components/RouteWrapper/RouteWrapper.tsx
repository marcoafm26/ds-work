import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './RouteWrapper.scss';

const RouteWrapper = () => {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState<boolean>(false);

    const verifyLogin = async () => {
        const response = await fetch('/api/verify', {
            credentials: 'include',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            navigate('/login');
            return;
        }
        setAuthenticated(true);
    };

    useEffect(() => {
        verifyLogin();
    }, []);

    if (!authenticated) {
        return null;
    }
    return (
        <div className="route-wrapper">
            <Outlet />
        </div>
    );
};

export default RouteWrapper;
