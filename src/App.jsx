import './App.css';
import logo from './assets/logo_proto.svg';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { Welcome } from './pages/welcome';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';

function Navigation() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user"));

    function handleLogout() {
        fetch('http://localhost:8080/User/logout', { method: "POST" }).catch(() => {});
        localStorage.removeItem("user");
        localStorage.removeItem("lastRecipientId");
        navigate("/login");
        window.location.reload();
    }

    return (
        <nav className="navbar">
            {/* 1. Linke Seite: Logo & Brand */}
            <div className="brand">
                <img src={logo} alt="OrchidChat Logo" />
                <span className="logo">OrchidChat</span>
            </div>

            {/* 2. Mitte: Eingeloggter Benutzer */}
            {storedUser && (
                <div className="navbar-center">
                    <span className="username">
                        {storedUser.firstname} {storedUser.lastname}
                    </span>
                </div>
            )}

            {/* 3. Rechte Seite: Navigations-Links & Logout */}
            <div className="nav-links">
                {!storedUser ? (
                    <>
                        <NavLink to="/">Start</NavLink>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/home">Chat</NavLink>
                        <button
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}

function App() {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    return (
        <BrowserRouter>
            <Navigation />

            <Routes>
                {/* Wenn eingeloggt, leitet "/" automatisch zum Chat ("/home") weiter */}
                <Route
                    path="/"
                    element={storedUser ? <Navigate to="/home" replace /> : <Welcome />}
                />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;