import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import RouteWrapper from './components/RouteWrapper/RouteWrapper';
import Account from './pages/Account/Account';
import Dashboard from './pages/Dashboard/Dashboard';
import Deposit from './pages/Deposit/Deposit';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Statement from './pages/Statement/Statement';
import Withdraw from './pages/Withdraw/Withdraw';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route id="unauthenticated" path="/">
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
                <Route id="authenticated" path="/" element={<RouteWrapper />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="account" element={<Account />} />
                    <Route path="deposit" element={<Deposit />} />
                    <Route path="withdraw" element={<Withdraw />} />
                    <Route path="statement" element={<Statement />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
