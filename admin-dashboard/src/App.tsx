import { Routes, Route, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './DashboardLayout.css'
import websocketService from './services/websocketService'
import { generateHtmlCssFromPrompt, buildSimpleInstruction } from './services/llmService'

function DashboardLayout() {
  return (
    <div className="dashboard-layout sleek-layout">
      <main className="dashboard-main">
        <div className="app-header">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="44" height="44" rx="12" fill="#232526"/>
            <path d="M14 32c6 0 10-4 10-10s-4-10-10-10v20z" fill="#f49c60"/>
            <circle cx="28" cy="22" r="6" fill="none" stroke="#f49c60" strokeWidth="2.5"/>
            <circle cx="34" cy="28" r="2.2" fill="#f49c60"/>
          </svg>
          <span className="brand-title">DynaQ Admin</span>
        </div>
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
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [instructionJson, setInstructionJson] = useState<any>(null);
  const [sendStatus, setSendStatus] = useState('');
  const [publish, setPublish] = useState(false);

  useEffect(() => {
    websocketService.connect('ws://localhost:5203');
    websocketService.onElementClick((msg) => {
      setSelectedElement(msg.data);
    });
    return () => {
      websocketService.disconnect();
    };
  }, []);

  useEffect(() => {
    // Send SET_DEBUGGING message after iframe src (domain) changes
    const timer = setTimeout(() => {
      const iframe = document.querySelector('.live-preview-iframe') as HTMLIFrameElement | null;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage({ type: 'SET_DEBUGGING', value: !publish }, '*');
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [domain, publish]);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setGeneratedCode('');
    setInstructionJson(null);
    try {
      let result = '';
      if (prompt.trim().toLowerCase() !== 'remove' && !prompt.trim().toLowerCase().startsWith('update:')) {
        result = await generateHtmlCssFromPrompt(prompt);
        setGeneratedCode(result);
      }
    } catch (err) {
      setError('Failed to generate code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendInstruction = async (shouldPublish = false) => {
    if (selectedElement) {
      let result = generatedCode;
      const instruction = buildSimpleInstruction(selectedElement, result, prompt);
      websocketService.sendInstruction(instruction, shouldPublish);
      if(shouldPublish){
        const apiPayload = {
          ...instruction,
          "type": "inject-instruction",
          "publish": shouldPublish,
          "timestamp": new Date().toISOString()
        };
        
        try {
          const response = await fetch('http://localhost:5203/api/Instructions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiPayload)
          });
         
          if (response.ok) {
            const currentDomain = domain;
       
   
        setDomain('about:blank');
   
        setTimeout(() => {
          setDomain(currentDomain);
        }, 100);
          }
          else{
            throw new Error(`API request failed with status ${response.status}`);
          }
         
         
        } catch (error) {
          console.error('Failed to send instruction via API:', error);
        }
      }
      setInstructionJson(instruction);
      setPublish(shouldPublish);
      setSendStatus('Instruction sent to target domain!');
      setTimeout(() => setSendStatus(''), 2000);
    }
  };

  return (
    <div className="dashboard-home-content spreadout-layout">
      <div className="live-preview-row">
        <div className="live-preview-container wide">
          <div className="live-preview-header-row">
            <div className="live-preview-label">Live Preview</div>
            <input
              className="domain-input"
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. https://example.com)"
            />
          </div>
          <iframe
            title="Live Preview"
            src={domain}
            className="live-preview-iframe"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        <div className="prompt-container">
        <textarea
  className="prompt-input"
  value={prompt}
  onChange={e => setPrompt(e.target.value)}
  placeholder="Describe what you want to add (e.g., Add a blue button below the header)"
/>
          <div className="prompt-actions">
            <div className="prompt-actions-left">
            <button className="generate-btn" onClick={handleGenerate} disabled={loading || !prompt}>
              {loading ? 'Generating...' : 'Generate'}
            </button>
            <button className="generate-btn" onClick={() => handleSendInstruction()}>
              Apply
            </button>
            </div>
            <button className="generate-btn" onClick={() => handleSendInstruction(true)} >
              Publish
            </button>
          </div>
          {sendStatus && <div style={{ color: 'green', marginTop: 8 }}>{sendStatus}</div>}
          {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
          {generatedCode && (
            <div className="code-preview-container">
              {/* <div className="code-section">
                <div className="generated-code-label">Generated HTML/CSS</div>
                <pre className="generated-code-block">{generatedCode}</pre>
              </div> */}
              <div className="preview-section">
                <div className="preview-label">Preview</div>
                <div className="preview-frame">
                  <iframe
                    srcDoc={generatedCode.replace(/^```html\n?/, '').replace(/\n?```$/, '')}
                    className="preview-iframe"
                    title="HTML/CSS Preview"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
