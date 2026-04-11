import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Shield, Download, Link as LinkIcon, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [url, setUrl] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState('');

    const handleDownload = async (e) => {
        e.preventDefault();
        setIsDownloading(true);
        setError('');

        try {
            const response = await api.post('/api/download', { url }, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            const blob = new Blob([response.data], { type: 'audio/mpeg' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'audio.mp3');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
            setUrl('');
        } catch (err) {
            console.error('Download error:', err);
            setError('Download failed. Please check the URL or try again later.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Download MP3</h1>
                <p style={{ color: 'var(--text-muted)' }}>Paste a YouTube link below to start downloading</p>
            </div>

            <div style={{
                background: 'var(--card-bg)',
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid var(--border)',
                marginBottom: '32px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Download Audio</h2>
                <form onSubmit={handleDownload}>
                    <div className="form-group">
                        <div style={{ position: 'relative' }}>
                            <LinkIcon
                                size={18}
                                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                            />
                            <input
                                type="text"
                                placeholder="Paste YouTube URL here..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="error-message" style={{ marginBottom: '16px' }}>{error}</p>}
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={isDownloading}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <><Download size={20} /> Download MP3</>}
                    </button>
                </form>
            </div>

        </div>
    );
};

export default Dashboard;
