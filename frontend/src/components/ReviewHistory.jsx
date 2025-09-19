// ReviewHistory.jsx
import React from 'react';

export default function ReviewHistory({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-gray-500 italic">No past reviews yet.</p>;
  }

  return (
    <div className="review-history space-y-3">
      {history.map((h, idx) => (
        <div
          key={idx}
          className="p-3 border rounded-md bg-gray-50 flex justify-between items-center"
        >
          <div>
            <strong>{h.language || 'Unknown'}</strong> — {h.summary || 'No summary'}
            <div className="text-xs text-gray-500">{h.timestamp}</div>
          </div>
          <span className="text-sm font-semibold text-blue-600">{h.score}%</span>
        </div>
      ))}
    </div>
  );
}
