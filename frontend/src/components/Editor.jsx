import React from 'react';
import MonacoEditor from '@monaco-editor/react';

export default function CodeEditor({ value, onChange }) {
  return (
    <div style={{ height: '600px', borderRadius: 6, overflow: 'hidden' }}>
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        value={value}
        onChange={(val = '') => onChange(val)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
