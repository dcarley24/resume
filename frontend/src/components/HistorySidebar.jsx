import React from 'react';

const HistorySidebar = ({ history, onSelect, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '300px',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--border-color)',
            padding: '1.5rem',
            zIndex: 1000,
            overflowY: 'auto',
            boxShadow: '-5px 0 15px rgba(0,0,0,0.3)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Job History</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>

            {history.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No history yet.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {history.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => onSelect(item)}
                            style={{
                                background: 'var(--bg-primary)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                border: '1px solid var(--border-color)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            className="history-item"
                        >
                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                                {new Date(item.timestamp).toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {item.job_description_text.substring(0, 50)}...
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistorySidebar;
