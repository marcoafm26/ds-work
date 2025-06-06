import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Login from './pages/Login/Login';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route id="authenticated" path="/">
                    <Route path="login" element={<Login />} />
                </Route>
                <Route id="unauthenticated" path="/"></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
