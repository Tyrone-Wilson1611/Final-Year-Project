import {Home, PlusSquare, User, LogOut} from "lucide-react";
import { useAuth } from "../context/auth.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";

    //responsible for navigation in application
const Navbar = () => {
    const {user, logout} = useAuth();
    const [openMenu, setOpenMenu] = useState(false);

    return (
        <header className="nav-app">
            <Link to="/" className="nav-brand">
            PhotoPort
            </Link>

            <nav className="nav-actions">
                <Link to="/" aria-label= "Home">
                <Home size={22} /></Link>

                <div className="menu-wrap">
                    <button 
                    type="button"
                    className="icon-button"
                    aria-label="create"
                    onClick={() => setOpenMenu((open) => !open)}>
                    <PlusSquare size = {22} />
                    </button>

                   {openMenu && (
                        <div className="create-menu">
                            <Link to="/upload">Create Post</Link>

                            <Link to={`/users/${user?.username}?tab=portfolio&builder=true`}>
                                Create Portfolio
                            </Link>
                        </div>
                    )}
                </div>

                <Link to={`/users/${user?.username}`} aria-label="My profile">
                    <User size={22} />
                </Link>

                <button type="button" onClick={logout} aria-label="Logout">
                    <LogOut size={22} />
                </button>
            </nav>
        </header>
    );
};

export default Navbar;