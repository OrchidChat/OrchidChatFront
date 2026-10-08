import { Link } from "react-router-dom";

export function Welcome() {
    return (
        <div className="welcome">
            <h1>OrchidChat</h1>
            <p>What blooms in Orchid, stays in Orchid</p>

            <div className="welcome-buttons">
                <Link to="/register" className="button">Registrieren</Link>
                <Link to="/login" className="button button-light">Login</Link>
            </div>
        </div>
    );
}