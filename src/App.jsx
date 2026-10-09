import './App.css';
import logo from './assets/logo_proto.svg';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Welcome } from './pages/welcome';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';

function App() {
    return (
        <BrowserRouter>
            <nav className="navbar">
                <div className="brand">
                    <img src={logo} alt="OrchidChat Logo" />
                    <span className="logo">OrchidChat</span>
                </div>


                <div className="nav-links">
                    <NavLink to="/">Start</NavLink>
                    <NavLink to="/home">Chat</NavLink>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/register">Register</NavLink>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;