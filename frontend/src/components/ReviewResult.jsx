// ReviewResult.jsx
import React from 'react';
import { exportAsJSON, exportAsMarkdown, exportAsPDF } from '../utils/exportUtils';

const severityColor = {
  critical: '#ff6b6b',
  moderate: '#ffb86b',
  minor: '#7ee787',
};

const languageStyles = {
  javascript: { bg: '#facc15', color: '#000', label: '🟨 JS' },
  python: { bg: '#3b82f6', color: '#fff', label: '🐍 Python' },
  java: { bg: '#f97316', color: '#fff', label: '☕ Java' },
  cpp: { bg: '#9333ea', color: '#fff', label: '💠 C++' },
  default: { bg: '#64748b', color: '#fff', label: '📄 Code' },
};

export default function ReviewResult({ result }) {
  // Case: no review yet
  if (!result || (!result.summary && (!result.issues || result.issues.length === 0))) {
    return (
      <div className="review-result text-gray-400 italic">
        No review results yet. Paste code and click <strong>Review</strong>.
      </div>
    );
  }

  // Case: API returned an error
  if (result.error) {
    return <div className="error">Error: {JSON.stringify(result.error)}</div>;
  }

  const { language, score, issues = [], summary = '', suggestions = [] } = result;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const langKey = language?.toLowerCase();
  const langStyle = languageStyles[langKey] || languageStyles.default;

  return (
    <div className="review-result">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <span
          style={{
            backgroundColor: langStyle.bg,
            color: langStyle.color,
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: '600',
          }}
        >
          {langStyle.label}
        </span>

        {/* Score Gamification */}
        {score !== undefined && (
          <div style={{ flex: 1, marginLeft: 20 }}>
            <div style={{ background: '#1e293b', height: 12, borderRadius: 6, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${score || 0}%`,
                  background: score >= 80 ? '#22c55e' : score >= 50 ? '#facc15' : '#ef4444',
                  height: '100%',
                }}
              ></div>
            </div>
            <div style={{ fontSize: '0.8rem', marginTop: 4, textAlign: 'right' }}>
              {score}% clean {score >= 80 ? '🚀' : score >= 50 ? '✨' : '⚠️'}
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-3">
          <h4>Summary</h4>
          <p>{summary}</p>
        </div>
      )}

      {/* Issues */}
      <div className="mb-3">
        <h4>Issues</h4>
        {issues.length === 0 ? (
          <p>No issues found.</p>
        ) : (
          issues.map((issue, i) => (
            <div
              key={i}
              style={{
                borderLeft: `4px solid ${severityColor[issue.severity] || '#888'}`,
                padding: 8,
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{issue.severity}</div>
              <div>{issue.message}</div>
              {issue.suggestion && (
                <div style={{ marginTop: 8 }}>
                  <pre style={{ background: '#071026', padding: 8 }}>{issue.suggestion}</pre>
                  <button
                    onClick={() => copyToClipboard(issue.suggestion)}
                    className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Copy Fix
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* AI Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="mb-4">
          <h4>AI Suggestions</h4>
          {suggestions.map((s, idx) => (
            <div key={idx} className="mb-2">
              <pre style={{ background: '#071026', padding: 8 }}>{s}</pre>
              <button
                onClick={() => copyToClipboard(s)}
                className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Copy Fix
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Export Options */}
      <div className="mt-6">
        <h4>Export Options</h4>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => exportAsJSON(result)}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export JSON
          </button>
          <button
            onClick={() => exportAsMarkdown(result)}
            className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Export Markdown
          </button>
          <button
            onClick={() => exportAsPDF(result)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
