import { Routes, Route, NavLink, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './DashboardLayout.css'
import MonacoEditor from '@monaco-editor/react'
import websocketService from './services/websocketService'
import { generateHtmlCssFromPrompt } from './services/llmService'

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#6366F1"/>
            <path d="M10 22L22 10M10 10H22V22" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="brand-title">DynaQ Admin</span>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="/" end className={({ isActive }: { isActive: boolean }) => isActive ? 'active' : ''}>
                <span className="sidebar-icon" aria-hidden="true">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9M4.5 10.5V21h15V10.5"/></svg>
                </span>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={({ isActive }: { isActive: boolean }) => isActive ? 'active' : ''}>
                <span className="sidebar-icon" aria-hidden="true">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15 8.6a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 15z"/></svg>
                </span>
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}

function Home() {
  const [domain, setDomain] = useState('https://example.com');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    websocketService.connect('ws://localhost:5203');
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setGeneratedCode('');
    try {
      const result = await generateHtmlCssFromPrompt(prompt);
      setGeneratedCode(result);
    } catch (err) {
      setError('Failed to generate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-home-content">
      <h2>Dashboard Home</h2>
      <div className="live-preview-container">
        <div className="live-preview-label">Live Preview</div>
        <input
          className="domain-input"
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          placeholder="Enter domain (e.g. https://example.com)"
        />
        <iframe
          title="Live Preview"
          src={domain}
          className="live-preview-iframe"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
      <div className="prompt-container">
        <input
          className="prompt-input"
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe what you want to add (e.g., Add a blue button below the header)"
        />
        <button className="generate-btn" onClick={handleGenerate} disabled={loading || !prompt}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      {generatedCode && (
        <div className="generated-code-preview">
          <div className="generated-code-label">Generated HTML/CSS</div>
          <pre className="generated-code-block">{generatedCode}</pre>
        </div>
      )}
    </div>
  )
}

function About() {
  return <h2>About Page</h2>
}

function Settings() {
  return <h2>Settings (placeholder)</h2>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
