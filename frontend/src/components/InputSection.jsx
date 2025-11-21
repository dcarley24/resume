import React, { useRef } from 'react';

const InputSection = ({
    resumeText,
    setResumeText,
    jdText,
    setJdText,
    onOptimize,
    isOptimizing
}) => {
    const resumeInputRef = useRef(null);
    const jdInputRef = useRef(null);

    const handleFileUpload = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', 'current_user'); // In a real app, pass actual ID
        formData.append('type', type);

        try {
            let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            if (API_URL && !API_URL.includes('localhost') && !API_URL.includes('.')) {
                API_URL = `https://${API_URL}.onrender.com`;
            } else if (!API_URL.startsWith('http')) {
                API_URL = `https://${API_URL}`;
            }
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (type === 'resume') {
                setResumeText(data.extracted_text);
            } else {
                setJdText(data.extracted_text);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload file.");
        }
    };

    return (
        <div className="glass-panel">
            <div className="section-title">Input Documents</div>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Original Resume
                    </label>
                    <button
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={() => resumeInputRef.current.click()}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)' }}
                    >
                        Upload PDF/DOCX
                    </button>
                    <input
                        type="file"
                        ref={resumeInputRef}
                        style={{ display: 'none' }}
                        accept=".pdf,.docx,.txt"
                        onChange={(e) => handleFileUpload(e, 'resume')}
                    />
                </div>
                <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content here or upload a file..."
                    rows={10}
                    style={{ resize: 'vertical' }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Job Description
                    </label>
                    <button
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={() => jdInputRef.current.click()}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)' }}
                    >
                        Upload PDF/DOCX
                    </button>
                    <input
                        type="file"
                        ref={jdInputRef}
                        style={{ display: 'none' }}
                        accept=".pdf,.docx,.txt"
                        onChange={(e) => handleFileUpload(e, 'jd')}
                    />
                </div>
                <textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the job description here or upload a file..."
                    rows={8}
                    style={{ resize: 'vertical' }}
                />
            </div>

            <button
                className="btn"
                style={{ width: '100%' }}
                onClick={onOptimize}
                disabled={isOptimizing}
            >
                {isOptimizing ? 'Optimizing...' : 'Generate Optimized Resume'}
            </button>
        </div>
    );
};

export default InputSection;
