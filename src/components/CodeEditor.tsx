import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileNode } from '../types';

interface CodeEditorProps {
  activeFile?: string;
  files: FileNode[];
  onFileChange: (filePath: string, content: string) => void;
}

const getLanguageFromPath = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'tsx':
    case 'ts':
      return 'typescript';
    case 'jsx':
    case 'js':
      return 'javascript';
    case 'json':
      return 'json';
    case 'css':
      return 'css';
    case 'html':
      return 'html';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
};

const findFileContent = (files: FileNode[], path: string): string => {
  for (const file of files) {
    if (file.path === path) {
      return file.content || '';
    }
    if (file.children) {
      const found = findFileContent(file.children, path);
      if (found !== '') return found;
    }
  }
  return '';
};

export const CodeEditor: React.FC<CodeEditorProps> = ({ activeFile, files, onFileChange }) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Set up editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      fontFamily: "'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace",
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (activeFile && value !== undefined) {
      onFileChange(activeFile, value);
    }
  };

  if (!activeFile) {
    return (
      <div className="h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold mb-2">Welcome to AI React App Builder</h3>
          <p className="text-gray-500 max-w-md">
            Select a file from the explorer to start editing, or use the AI assistant to generate new code.
          </p>
        </div>
      </div>
    );
  }

  const fileContent = findFileContent(files, activeFile);
  const language = getLanguageFromPath(activeFile);

  return (
    <div className="h-full bg-gray-900">
      <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-3">
        <span className="text-sm text-gray-300 font-medium">{activeFile}</span>
      </div>
      <div className="h-[calc(100%-2.5rem)]">
        <Editor
          height="100%"
          language={language}
          value={fileContent}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            glyphMargin: true,
            folding: true,
            lineNumbers: 'on',
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 3,
            scrollbar: {
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
            },
          }}
        />
      </div>
    </div>
  );
};