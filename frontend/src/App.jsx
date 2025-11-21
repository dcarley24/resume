import React, { useState, useEffect } from 'react';
import UserSelector from './components/UserSelector';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import HistorySidebar from './components/HistorySidebar';

function App() {
  const [currentUser, setCurrentUser] = useState('User 1');

  // State for User 1
  const [user1Data, setUser1Data] = useState({ resume: '', jd: '', optimized: null, analysis: null, feedback: '' });

  // State for User 2
  const [user2Data, setUser2Data] = useState({ resume: '', jd: '', optimized: null, analysis: null, feedback: '' });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Helper to get current user's data
  const currentData = currentUser === 'User 1' ? user1Data : user2Data;
  const setCurrentData = (newData) => {
    if (currentUser === 'User 1') {
      setUser1Data({ ...user1Data, ...newData });
    } else {
      setUser2Data({ ...user2Data, ...newData });
    }
  };

  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('');

  const fetchHistory = async () => {
    try {
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      if (!API_URL.startsWith('http')) {
        API_URL = `https://${API_URL}`;
      }
      setApiUrl(API_URL);

      const response = await fetch(`${API_URL}/history/${currentUser}`);
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
      const data = await response.json();
      setHistory(data.reverse()); // Newest first
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentUser]);

  const handleNewJob = () => {
    if (window.confirm("Start a new job? This will clear the current form.")) {
      setCurrentData({ resume: '', jd: '', optimized: null, analysis: null, feedback: '' });
    }
  };

  const handleLoadHistory = (item) => {
    setCurrentData({
      resume: item.resume_text,
      jd: item.job_description_text,
      optimized: item.optimized_resume,
      analysis: item.analysis,
      feedback: ''
    });
    setIsHistoryOpen(false);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);

    try {
      let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      if (!API_URL.startsWith('http')) {
        API_URL = `https://${API_URL}`;
      }
      const response = await fetch(`${API_URL}/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser,
          resume_text: currentData.resume,
          job_description_text: currentData.jd,
          feedback: currentData.feedback
        })
      });

      const data = await response.json();

      setCurrentData({
        optimized: data.optimized_resume,
        analysis: data.analysis
      });
      setIsOptimizing(false);
      fetchHistory(); // Refresh history after optimization

    } catch (error) {
      console.error("Optimization failed:", error);
      setIsOptimizing(false);
      alert("Failed to connect to backend. Make sure it's running!");
    }
  };

  return (
    <>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent-primary)', borderRadius: '8px' }}></div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>ResumeAI</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={handleNewJob}
            className="btn btn-secondary"
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            + New Job
          </button>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="btn btn-secondary"
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
          >
            History
          </button>
          <div style={{ fontSize: '0.8rem', color: connectionStatus === 'connected' ? 'var(--success)' : 'var(--error)', marginRight: '1rem' }}>
            {connectionStatus === 'connected' ? '● Online' : `● Offline (${apiUrl})`}
          </div>
          <UserSelector currentUser={currentUser} onUserChange={setCurrentUser} />
        </div>
      </header>

      <main className="main-content">
        <div className="column">
          <InputSection
            resumeText={currentData.resume}
            setResumeText={(text) => setCurrentData({ resume: text })}
            jdText={currentData.jd}
            setJdText={(text) => setCurrentData({ jd: text })}
            onOptimize={handleOptimize}
            isOptimizing={isOptimizing}
          />
        </div>

        <div className="column">
          <OutputSection
            optimizedContent={currentData.optimized}
            analysis={currentData.analysis}
            feedback={currentData.feedback}
            onFeedbackChange={(text) => setCurrentData({ feedback: text })}
            onRefine={handleOptimize}
            isOptimizing={isOptimizing}
          />
        </div>
      </main>

      <HistorySidebar
        history={history}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={handleLoadHistory}
      />
    </>
  );
}

export default App;
