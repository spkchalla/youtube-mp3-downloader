import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Account = () => {
    const { user } = useAuth();

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Your Account</h1>

            <div style={{
                background: 'var(--card-bg)',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                display: 'grid',
                gap: '32px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ background: 'var(--primary)', padding: '20px', borderRadius: '16px' }}>
                        <User size={40} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '700' }}>{user?.username}</h2>
                        <p style={{ color: 'var(--text-muted)' }}>{user?.role.toUpperCase()} ACCOUNT</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                    <div style={{ background: 'var(--glass)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                            <Mail size={18} />
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>EMAIL</span>
                        </div>
                        <p style={{ fontSize: '16px', fontWeight: '500' }}>{user?.email}</p>
                    </div>

                    <div style={{ background: 'var(--glass)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', color: 'var(--text-muted)' }}>
                            <Shield size={18} />
                            <span style={{ fontSize: '14px', fontWeight: '600' }}>ROLE</span>
                        </div>
                        <p style={{ fontSize: '16px', fontWeight: '500', textTransform: 'capitalize' }}>{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Account;
