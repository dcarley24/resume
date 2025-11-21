import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const OutputSection = ({ optimizedContent, analysis, feedback, onFeedbackChange, onRefine, isOptimizing }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Split text to fit page width
        const splitText = doc.splitTextToSize(optimizedContent, 180);

        let y = 20;
        // Simple pagination loop
        for (let i = 0; i < splitText.length; i++) {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(splitText[i], 15, y);
            y += 7;
        }

        doc.save('optimized_resume.pdf');
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(optimizedContent);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!optimizedContent) {
        return (
            <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>✨</div>
                    <p>Ready to optimize. Upload your documents to begin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {analysis && (
                <div style={{ marginBottom: '1.5rem', background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <div className="section-title" style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
                        AI Analysis
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                        {analysis}
                    </div>
                </div>
            )}

            <div className="section-title">
                <span>Optimized Resume</span>
                <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--success)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                    ATS Friendly
                </span>
            </div>

            <div style={{
                flex: 1,
                background: 'var(--bg-primary)',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: '1.6'
            }}>
                {optimizedContent}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={handleCopyToClipboard}
                >
                    {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                </button>
            </div>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div className="section-title" style={{ fontSize: '1rem' }}>Refine Result</div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <textarea
                        value={feedback || ''}
                        onChange={(e) => onFeedbackChange(e.target.value)}
                        placeholder="e.g., 'Make the summary more punchy' or 'Focus more on leadership'"
                        rows={2}
                        style={{ resize: 'none', fontSize: '0.9rem', flex: 1, padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                    />
                    <button
                        className="btn"
                        style={{ whiteSpace: 'nowrap', alignSelf: 'flex-start', height: 'auto', padding: '0.75rem 1.25rem' }}
                        onClick={onRefine}
                        disabled={isOptimizing || !feedback}
                    >
                        {isOptimizing ? '...' : 'Refine'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OutputSection;
