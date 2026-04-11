import React from 'react';

const About = () => {
    return (
        <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>About YouTube to MP3</h1>
            <div style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '32px', border: '1px solid var(--border)', textAlign: 'left' }}>
                <p style={{ marginBottom: '20px', fontSize: '18px', color: 'var(--text-muted)' }}>
                    This application allows you to easily convert and download your favorite YouTube videos into high-quality MP3 audio files.
                </p>
                <h3 style={{ marginBottom: '12px', fontSize: '20px', fontWeight: '700' }}>Features:</h3>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '2' }}>
                    <li>Fast and reliable conversion using yt-dlp.</li>
                    <li>Embedded metadata and thumbnails.</li>
                    <li>History tracking to easily re-download your favorite songs.</li>
                    <li>Mobile-responsive design for on-the-go access.</li>
                    <li>Secure account management.</li>
                </ul>
                <p style={{ marginTop: '32px', fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Built with React, Node.js, MongoDB, and yt-dlp.
                </p>
            </div>
        </div>
    );
};

export default About;
