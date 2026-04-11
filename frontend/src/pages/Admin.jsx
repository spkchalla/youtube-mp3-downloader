import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, Trash2, UserPlus, UserMinus, Loader2, Search } from 'lucide-react';

const Admin = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('/api/admin/users', {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        try {
            await axios.put(`/api/admin/users/${userId}`, { role: newRole }, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${currentUser.token}` }
            });
            setUsers(users.filter(u => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800' }}>User Management</h1>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u._id}>
                                <td style={{ fontWeight: '600' }}>{u.username}</td>
                                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                                <td>
                                    <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button
                                            onClick={() => handleUpdateRole(u._id, u.role)}
                                            style={{ background: 'transparent', color: 'var(--primary)', padding: 0 }}
                                            title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                            disabled={u._id === currentUser._id}
                                        >
                                            {u.role === 'admin' ? <UserMinus size={18} /> : <UserPlus size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(u._id)}
                                            style={{ background: 'transparent', color: 'var(--error)', padding: 0 }}
                                            title="Delete User"
                                            disabled={u._id === currentUser._id}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;
