import { useState } from "react";
import {
    NavLink,
    useNavigate
} from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {

    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const handleSearch = (e) => {

        e.preventDefault();

        const query = search.trim();

        if (!query) {
            return;
        }

        navigate(
            `/search?q=${encodeURIComponent(query)}`
        );

        // Close mobile menu after search
        setMenuOpen(false);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="navbar">

            {/* Logo */}
            <div className="logo">
                Ani<span>Knight</span>
            </div>

            {/* Desktop / Mobile Navigation */}
            <nav className={menuOpen ? "nav-menu active" : "nav-menu"}>

                <NavLink to="/" onClick={closeMenu}>
                    Home
                </NavLink>

                <NavLink to="#movies" onClick={closeMenu}>
                    Movies
                </NavLink>

                <NavLink to="#series" onClick={closeMenu}>
                    TV Series
                </NavLink>

                <NavLink to="#watch" onClick={closeMenu}>
                    Watch
                </NavLink>

                {/* Mobile actions */}
                <div className="mobile-actions">

                    <form
                        className="search-form"
                        onSubmit={handleSearch}
                    >
                        <input
                            type="text"
                            placeholder="Search anime..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            className="search-btn"
                        >
                            Search
                        </button>
                    </form>

                    <button className="login-btn">
                        Login
                    </button>

                </div>

            </nav>

            {/* Desktop Actions */}
            <div className="nav-actions">

                <form
                    className="search-form"
                    onSubmit={handleSearch}
                >
                    <input
                        type="text"
                        placeholder="Search anime..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <button
                        type="submit"
                        className="search-btn"
                    >
                        Search
                    </button>
                </form>

                <button className="login-btn">
                    Login
                </button>

            </div>

            {/* Hamburger */}
            <button
                className={`menu-toggle ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

        </header>
    );
};

export default Navbar;