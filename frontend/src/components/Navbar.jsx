import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Info, Music, Shield, LogOut, User as UserIcon, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const NavLinks = ({ isMobile = false }) => (
        <>
            {user ? (
                <>
                    <Link to="/" className={`${isMobile ? 'drawer-link' : 'nav-link'} ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>
                        <Home size={18} /> Home
                    </Link>
                    <Link to="/songs" className={`${isMobile ? 'drawer-link' : 'nav-link'} ${isActive('/songs') ? 'active' : ''}`} onClick={closeMenu}>
                        <Music size={18} /> Your Songs
                    </Link>
                    <Link to="/about" className={`${isMobile ? 'drawer-link' : 'nav-link'} ${isActive('/about') ? 'active' : ''}`} onClick={closeMenu}>
                        <Info size={18} /> About
                    </Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" className={`${isMobile ? 'drawer-link' : 'nav-link'} ${isActive('/admin') ? 'active' : ''}`} onClick={closeMenu}>
                            <Shield size={18} /> Admin
                        </Link>
                    )}
                    {!isMobile && <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>}
                    <Link to="/account" className={`${isMobile ? 'drawer-link' : 'nav-link'} ${isActive('/account') ? 'active' : ''}`} onClick={closeMenu}>
                        <UserIcon size={18} /> Account
                    </Link>
                    <button
                        onClick={() => { logout(); closeMenu(); }}
                        style={{
                            background: 'transparent',
                            color: 'var(--error)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: isMobile ? '0.75rem 0' : 0,
                            fontSize: isMobile ? '1.125rem' : 'inherit',
                            fontWeight: isMobile ? '500' : 'bold',
                            borderBottom: isMobile ? '1px solid var(--border)' : 'none',
                            width: isMobile ? '100%' : 'auto',
                            justifyContent: isMobile ? 'flex-start' : 'center'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/about" className={`${isMobile ? 'drawer-link' : 'nav-link'} ${isActive('/about') ? 'active' : ''}`} onClick={closeMenu}>
                        <Info size={18} /> About
                    </Link>
                    <Link to="/login" className="btn-primary" style={{ padding: '8px 20px', width: isMobile ? '100%' : 'auto', textAlign: 'center' }} onClick={closeMenu}>Sign In</Link>
                </>
            )}
        </>
    );

    return (
        <>
            <nav className="navbar">
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.25rem', color: 'var(--text)' }} onClick={closeMenu}>
                    <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px' }}>
                        <Music size={20} color="white" />
                    </div>
                    YT2MP3
                </Link>

                {/* Desktop Menu */}
                <div className="nav-links">
                    <NavLinks />
                </div>

                {/* Burger Icon */}
                <button className="menu-toggle" onClick={toggleMenu} style={{ display: 'none' }}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Drawer */}
            <div className={`drawer-overlay ${isOpen ? 'visible' : ''}`} onClick={closeMenu}></div>
            <div className={`mobile-drawer ${isOpen ? 'open' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                    <button onClick={closeMenu} style={{ background: 'transparent', color: 'var(--text)' }}>
                        <X size={28} />
                    </button>
                </div>
                <NavLinks isMobile={true} />
            </div>
        </>
    );
};

export default Navbar;
