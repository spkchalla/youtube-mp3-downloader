import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Download, Trash2, Music, Loader2, AlertTriangle, Info, X } from 'lucide-react';

const Songs = () => {
    const { user } = useAuth();
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(null);
    const [selectedMetadataSong, setSelectedMetadataSong] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            const { data } = await api.get('/api/songs', {
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
            await api.delete(`/api/songs/${deleteId}`, {
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
            const response = await api.post('/api/download', { url: song.url }, {
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

    const filteredAndSortedSongs = songs
        .filter(song => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                (song.title && song.title.toLowerCase().includes(query)) ||
                (song.uploader && song.uploader.toLowerCase().includes(query))
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'title-asc':
                    return (a.title || '').localeCompare(b.title || '');
                case 'title-desc':
                    return (b.title || '').localeCompare(a.title || '');
                case 'longest':
                    return (b.duration || 0) - (a.duration || 0);
                case 'shortest':
                    return (a.duration || 0) - (b.duration || 0);
                case 'most-views':
                    const aViews = a.rawMetadata?.view_count || 0;
                    const bViews = b.rawMetadata?.view_count || 0;
                    return bViews - aViews;
                case 'newest':
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    const renderRawMetadata = (rawMetadata) => {
        if (!rawMetadata) return <p style={{ color: 'var(--text-muted)' }}>No raw metadata available (old download).</p>;
        
        // Filter out massive internal arrays or objects for better readability
        const filteredKeys = Object.keys(rawMetadata).filter(k => 
            !['formats', 'thumbnails', 'subtitles', 'automatic_captions', 'fragments', 'heatmap'].includes(k) &&
            rawMetadata[k] !== null
        );

        return (
            <div style={{ 
                background: 'var(--glass)', 
                padding: '16px', 
                borderRadius: '8px', 
                maxHeight: '400px', 
                overflowY: 'auto',
                fontSize: '13px',
                fontFamily: 'monospace'
            }}>
                {filteredKeys.map(key => (
                    <div key={key} style={{ marginBottom: '8px', wordBreak: 'break-word' }}>
                        <strong style={{ color: 'var(--primary)' }}>{key}: </strong>
                        <span style={{ color: 'var(--text-muted)' }}>
                            {typeof rawMetadata[key] === 'object' ? JSON.stringify(rawMetadata[key]) : String(rawMetadata[key])}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800' }}>Your Songs</h1>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                    <input 
                        type="text" 
                        placeholder="Search songs..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ maxWidth: '300px', background: 'var(--card-bg)' }}
                    />
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ 
                            padding: '12px 16px', 
                            background: 'var(--card-bg)', 
                            border: '1px solid var(--border)', 
                            borderRadius: '12px', 
                            color: 'var(--text)',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="title-asc">Title (A-Z)</option>
                        <option value="title-desc">Title (Z-A)</option>
                        <option value="longest">Longest First</option>
                        <option value="shortest">Shortest First</option>
                        <option value="most-views">Most Views (If Available)</option>
                    </select>
                </div>
            </div>

            {songs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: 'var(--card-bg)', borderRadius: '32px', border: '1px solid var(--border)' }}>
                    <Music size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No songs downloaded yet.</p>
                </div>
            ) : filteredAndSortedSongs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: 'var(--card-bg)', borderRadius: '32px', border: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No songs match your search criteria.</p>
                </div>
            ) : (
                <div className="songs-grid">
                    {filteredAndSortedSongs.map(song => (
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
                                    onClick={() => setSelectedMetadataSong(song)}
                                    style={{ background: 'var(--glass)', color: 'var(--text)', width: '80%', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontWeight: 'bold', padding: '8px', borderRadius: '12px' }}
                                >
                                    <Info size={18} /> Show Metadata
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

            {selectedMetadataSong && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '600px', width: '95%', textAlign: 'left', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Info size={24} color="var(--primary)" /> Full Metadata
                            </h2>
                            <button onClick={() => setSelectedMetadataSong(null)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-muted)', marginBottom: '16px', background: 'var(--card-bg)', padding: '16px', borderRadius: '12px' }}>
                                <p><strong style={{ color: 'var(--text)' }}>Title:</strong> {selectedMetadataSong.title}</p>
                                <p><strong style={{ color: 'var(--text)' }}>Uploader:</strong> {selectedMetadataSong.uploader}</p>
                                <p><strong style={{ color: 'var(--text)' }}>Duration:</strong> {Math.floor(selectedMetadataSong.duration / 60)}:{(selectedMetadataSong.duration % 60).toString().padStart(2, '0')}</p>
                                <p><strong style={{ color: 'var(--text)' }}>Downloaded On:</strong> {new Date(selectedMetadataSong.createdAt).toLocaleString()}</p>
                            </div>
                            
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', marginTop: '24px' }}>Raw System Metadata</h3>
                            {renderRawMetadata(selectedMetadataSong.rawMetadata)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Songs;
