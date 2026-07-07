import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Shield, Download, Link as LinkIcon, Loader2, ListMusic, Music } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [videoUrl, setVideoUrl] = useState('');
    const [playlistUrl, setPlaylistUrl] = useState('');
    
    const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
    const [videoError, setVideoError] = useState('');

    const [playlistItems, setPlaylistItems] = useState([]);
    const [isFetchingInfo, setIsFetchingInfo] = useState(false);
    const [playlistError, setPlaylistError] = useState('');
    const [downloadProgress, setDownloadProgress] = useState({});

    // Original single video download handler
    const handleDownloadVideo = async (e) => {
        e.preventDefault();
        setIsDownloadingVideo(true);
        setVideoError('');

        try {
            const response = await api.post('/api/download', { url: videoUrl }, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const blob = new Blob([response.data], { type: 'audio/mpeg' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `audio_${Date.now()}.mp3`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
            setVideoUrl('');
        } catch (err) {
            console.error('Download error:', err);
            setVideoError('Download failed. Please check the URL or try again later.');
        } finally {
            setIsDownloadingVideo(false);
        }
    };

    // Playlist fetch handler
    const handleFetchPlaylist = async (e) => {
        e.preventDefault();
        setIsFetchingInfo(true);
        setPlaylistError('');
        setPlaylistItems([]);

        try {
            if (playlistUrl.includes('list=')) {
                const response = await api.post('/api/playlist', { url: playlistUrl }, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setPlaylistItems(response.data.items);
            } else {
                setPlaylistError('This does not look like a valid YouTube playlist URL.');
            }
        } catch (err) {
            console.error('Info fetch error:', err);
            setPlaylistError('Failed to fetch playlist info. Please check the URL.');
        } finally {
            setIsFetchingInfo(false);
        }
    };

    // Individual playlist item download handler
    const handleDownloadItem = async (itemUrl, itemId) => {
        setDownloadProgress(prev => ({ ...prev, [itemId]: true }));
        try {
            const response = await api.post('/api/download', { url: itemUrl }, {
                responseType: 'blob',
                headers: { Authorization: `Bearer ${user.token}` }
            });

            const blob = new Blob([response.data], { type: 'audio/mpeg' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `audio_${Date.now()}.mp3`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Download error:', err);
            setPlaylistError('Failed to download an item.');
        } finally {
            setDownloadProgress(prev => ({ ...prev, [itemId]: false }));
        }
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Download MP3</h1>
                <p style={{ color: 'var(--text-muted)' }}>Choose between a single video or an entire playlist</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                {/* Single Video Card */}
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <Music size={24} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Single Video</h2>
                    </div>
                    <form onSubmit={handleDownloadVideo}>
                        <div className="form-group">
                            <div style={{ position: 'relative' }}>
                                <LinkIcon
                                    size={18}
                                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Paste YouTube Video URL..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                        </div>
                        {videoError && <p className="error-message" style={{ marginBottom: '16px' }}>{videoError}</p>}
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isDownloadingVideo}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}
                        >
                            {isDownloadingVideo ? <Loader2 className="animate-spin" size={20} /> : <><Download size={20} /> Download MP3</>}
                        </button>
                    </form>
                </div>

                {/* Playlist Card */}
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(var(--primary-rgb), 0.1)', padding: '12px', borderRadius: '12px' }}>
                            <ListMusic size={24} color="var(--primary)" />
                        </div>
                        <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Full Playlist</h2>
                    </div>
                    <form onSubmit={handleFetchPlaylist}>
                        <div className="form-group">
                            <div style={{ position: 'relative' }}>
                                <LinkIcon
                                    size={18}
                                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Paste YouTube Playlist URL..."
                                    value={playlistUrl}
                                    onChange={(e) => setPlaylistUrl(e.target.value)}
                                    style={{ paddingLeft: '40px' }}
                                    required
                                />
                            </div>
                        </div>
                        {playlistError && <p className="error-message" style={{ marginBottom: '16px' }}>{playlistError}</p>}
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isFetchingInfo}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)' }}
                        >
                            {isFetchingInfo ? <Loader2 className="animate-spin" size={20} /> : 'Fetch Playlist'}
                        </button>
                    </form>
                </div>

            </div>

            {playlistItems.length > 0 && (
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '32px',
                    borderRadius: '24px',
                    border: '1px solid var(--border)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
                        Found {playlistItems.length} items in Playlist
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {playlistItems.map((item, idx) => {
                            const itemId = item.id || idx;
                            return (
                                <div key={itemId} className="playlist-item">
                                    <div className="playlist-item-info">
                                        {item.id && (
                                            <img 
                                                src={`https://i.ytimg.com/vi/${item.id}/mqdefault.jpg`} 
                                                alt="thumbnail" 
                                                className="playlist-item-thumb"
                                            />
                                        )}
                                        <span className="playlist-item-title">
                                            {item.title}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleDownloadItem(item.url, itemId)}
                                        className="btn-primary playlist-item-btn"
                                        disabled={downloadProgress[itemId]}
                                    >
                                        {downloadProgress[itemId] ? <Loader2 className="animate-spin" size={16} /> : <><Download size={16} /> Download</>}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
