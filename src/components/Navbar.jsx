import { useState } from 'react'
import { NavLink } from 'react-router-dom';

const Navbar = () => {
      const [search, setSearch] = useState("");
    
  return (
    <div>
        <header className="navbar">
        <div className="logo">
          Ani<span>Verse</span>
        </div>

        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="#movies">Movies</NavLink>
          <NavLink to="#series">TV Series</NavLink>
          <NavLink to="#watch">Watch</NavLink>
        </nav>

        <div className="nav-actions">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="login-btn">Login</button>
        </div>
      </header>
    </div>
  )
}

export default Navbar