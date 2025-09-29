// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/Editor';
import ReviewResult from '../components/ReviewResult';
import ReviewHistory from '../components/ReviewHistory';   
import { submitReview } from '../services/review';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [code, setCode] = useState('// Paste your code here\n');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
   const [history, setHistory] = useState([]);   // ✅ review history
  const [autoReview, setAutoReview] = useState(false); // NEW
  const { logout, user } = useAuth();

  const handleReview = async () => {
    if (!code.trim()) {
      setResult(null);
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const data = await submitReview(code);
      setResult(data);
    } catch (err) {
      setResult({ error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }


  try {
      const data = await submitReview(code);
      setResult(data);
        // ✅ Save history with timestamp
      setHistory((prev) => [
        { ...data, timestamp: new Date().toLocaleString() },
        ...prev,
      ]);
    } catch (err) {
      setResult({ error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

    // Auto review when code changes
  useEffect(() => {
    if (autoReview && code.trim()) {
      const timeout = setTimeout(() => handleReview(), 800); // debounce
      return () => clearTimeout(timeout);
    }
  }, [code, autoReview]);

  return (
    <div className="dashboard min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-white shadow px-6 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600">AI Code Reviewer</h1>
        <div className="flex items-center gap-4">
          {/* Auto Review Toggle */}
          <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={autoReview}
              onChange={() => setAutoReview(!autoReview)}
            />
            Auto Review
          </label>
          <span className="text-gray-700">{user?.email}</span>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </header>

       {/* Main Content */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Section */}
        <section className="editor-section bg-white shadow rounded-lg p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Code Editor</h2>
          <CodeEditor
            value={code}
            onChange={(v) => {
              setCode(v);
              if (v.trim() === "") setResult(null);
            }}
          />
          {!autoReview && (
            <div className="controls mt-4 flex justify-center">
              <button
                onClick={handleReview}
                disabled={loading || !code.trim()}
                className={`px-6 py-2 rounded-md text-white font-medium transition ${
                  loading || !code.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {loading ? 'Analyzing...' : 'Review Code'}
              </button>
            </div>
          )}
        </section>

        {/* Results Section */}
        <section className="result-section bg-white shadow rounded-lg p-4 overflow-auto">
          <h2 className="text-lg font-semibold mb-2">Review Results</h2>
          {result ? (
            <ReviewResult result={result} />
          ) : (
            <p className="text-gray-500 italic">Review results will appear here</p>
          )}
        </section>
      </main>

      {/* Review History Section */}
      <section className="history-section bg-white shadow rounded-lg p-4 m-6">
        <h2 className="text-lg font-semibold mb-2">Review History</h2>
        <ReviewHistory history={history} />
      </section>
    </div>
  );
}
