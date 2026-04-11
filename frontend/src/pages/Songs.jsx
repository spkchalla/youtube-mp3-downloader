import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Download, Trash2, Music, Loader2, AlertTriangle } from 'lucide-react';

const Songs = () => {
    const { user } = useAuth();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(null);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const { data } = await axios.get('/api/songs', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSongs(data);
        } catch (err) {
            console.error('Error fetching songs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/songs/${deleteId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setSongs(songs.filter(s => s._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error('Error deleting song:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDownloadAgain = async (song) => {
        setIsDownloading(song._id);
        try {
            const response = await axios.post('/api/download', { url: song.url }, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const blob = new Blob([response.data], { type: 'audio/mpeg' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${song.title}.mp3`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Download error:', err);
        } finally {
            setIsDownloading(null);
        }
    };

    if (loading) return <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '32px' }}>Your Songs</h1>

            {songs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: 'var(--card-bg)', borderRadius: '32px', border: '1px solid var(--border)' }}>
                    <Music size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No songs downloaded yet.</p>
                </div>
            ) : (
                <div className="songs-grid">
                    {songs.map(song => (
                        <div key={song._id} className="song-card">
                            <img src={song.thumbnail} alt={song.title} className="song-thumbnail" />
                            <div className="song-info">
                                <p className="song-title">{song.title}</p>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>{song.uploader}</p>
                                <div className="song-meta">
                                    <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                                    <span>{new Date(song.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="song-overlay">
                                <button
                                    onClick={() => handleDownloadAgain(song)}
                                    className="btn-primary"
                                    disabled={isDownloading !== null}
                                    style={{ width: '80%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                                >
                                    {isDownloading === song._id ? <Loader2 className="animate-spin" size={18} /> : <><Download size={18} /> Download Again</>}
                                </button>
                                <button
                                    onClick={() => setDeleteId(song._id)}
                                    style={{ background: 'transparent', color: 'var(--error)', width: '80%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontWeight: 'bold' }}
                                >
                                    <Trash2 size={18} /> Delete Song
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteId && (
                <div className="modal-overlay">
                    <div className="modal">
                        <AlertTriangle size={48} color="var(--error)" style={{ marginBottom: '16px' }} />
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Confirm Deletion</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Are you sure you want to remove this song from your history?</p>
                        <div className="modal-actions">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="btn-primary"
                                style={{ background: 'var(--glass)', color: 'var(--text)', flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="btn-primary"
                                disabled={isDeleting}
                                style={{ background: 'var(--error)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {isDeleting ? <Loader2 className="animate-spin" size={18} /> : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Songs;
