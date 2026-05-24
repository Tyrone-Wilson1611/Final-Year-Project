import {Home, PlusSquare, User, LogOut} from "lucide-react";
import { useAuth } from "../context/auth.jsx";
import { Link } from "react-router-dom";


const Navbar = () => {
    const {user, logout} = useAuth();

    return (
        <header className="nav-app">
            <Link to="/" className="nav-brand">
            PhotoPort
            </Link>

            <nav className="nav-actions">
                <Link to="/" aria-label = "Upload">
                <PlusSquare size = {22} />
                </Link>

                <button type="button" onClick={logout} aria-label="Logout">
                    <LogOut size={22} />
                </button>
            </nav>
        </header>
    )
}

export default Navbar;