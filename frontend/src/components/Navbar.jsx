import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Info, Music, Shield, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.25rem', color: 'var(--text)' }}>
                <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px' }}>
                    <Music size={20} color="white" />
                </div>
                YT2MP3
            </Link>

            <div className="nav-links">
                {user ? (
                    <>
                        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                            <Home size={18} /> Home
                        </Link>
                        <Link to="/songs" className={`nav-link ${isActive('/songs') ? 'active' : ''}`}>
                            <Music size={18} /> Your Songs
                        </Link>
                        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                            <Info size={18} /> About
                        </Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                                <Shield size={18} /> Admin
                            </Link>
                        )}
                        <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
                        <Link to="/account" className={`nav-link ${isActive('/account') ? 'active' : ''}`}>
                            <UserIcon size={18} /> Account
                        </Link>
                        <button onClick={logout} style={{ background: 'transparent', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0 }}>
                            <LogOut size={18} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                            <Info size={18} /> About
                        </Link>
                        <Link to="/login" className="btn-primary" style={{ padding: '8px 20px' }}>Sign In</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
