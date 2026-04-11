import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Shield } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px'
            }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Dashboard</h1>
                <button
                    onClick={logout}
                    className="btn-primary"
                    style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--error)' }}
                >
                    <LogOut size={18} /> Sign Out
                </button>
            </div>

            <div style={{
                background: 'var(--card-bg)',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                display: 'grid',
                gap: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px' }}>
                        <User size={24} color="white" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Username</p>
                        <p style={{ fontWeight: '600', fontSize: '18px' }}>{user?.username}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px' }}>
                        <Mail size={24} color="white" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Email Address</p>
                        <p style={{ fontWeight: '600', fontSize: '18px' }}>{user?.email}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px' }}>
                        <Shield size={24} color="white" />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Account Role</p>
                        <p style={{ fontWeight: '600', fontSize: '18px', textTransform: 'capitalize' }}>{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
