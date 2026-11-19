import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link to="/" className="brand">UCU Lost &amp; Found</Link>
        <nav aria-label="Main">
          <ul>
            <li><NavLink to="/" end>Browse items</NavLink></li>
            {user && <li><NavLink to="/report">Report an item</NavLink></li>}
            {user && <li><NavLink to="/my">My activity</NavLink></li>}
            {user?.role === 'admin' && <li><NavLink to="/admin">Review claims</NavLink></li>}
            {user ? (
              <>
                <li className="who">{user.name}</li>
                <li><button type="button" className="link-btn" onClick={handleLogout}>Log out</button></li>
              </>
            ) : (
              <li><NavLink to="/login">Log in</NavLink></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
