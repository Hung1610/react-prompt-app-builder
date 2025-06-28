import React, { useState } from 'react';
import { PromptPanel } from './components/PromptPanel';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { PreviewPanel } from './components/PreviewPanel';
import { EditorTabs } from './components/EditorTabs';
import { useResizer } from './hooks/useResizer';
import { sampleProject } from './data/sampleProject';
import { FileNode } from './types';

function App() {
  const [files, setFiles] = useState<FileNode[]>(sampleProject);
  const [activeFile, setActiveFile] = useState<string>('src/App.tsx');
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const { leftWidth, startResizing, containerRef, isResizing } = useResizer(40);

  const handlePromptSubmit = (prompt: string) => {
    console.log('AI Prompt:', prompt);
    // Here you would integrate with your AI service
    // For now, we'll just log the prompt
  };

  const handleFileSelect = (filePath: string) => {
    setActiveFile(filePath);
    // Switch to code tab when selecting a file
    setActiveTab('code');
  };

  const updateFileContent = (files: FileNode[], path: string, content: string): FileNode[] => {
    return files.map(file => {
      if (file.path === path) {
        return { ...file, content };
      }
      if (file.children) {
        return { ...file, children: updateFileContent(file.children, path, content) };
      }
      return file;
    });
  };

  const handleFileChange = (filePath: string, content: string) => {
    setFiles(prev => updateFileContent(prev, filePath, content));
  };

  const handleTabChange = (tab: 'code' | 'preview') => {
    setActiveTab(tab);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h1 className="text-lg font-semibold text-white">React App Builder</h1>
        </div>
      </div>

      {/* Main Content */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Left Panel - AI Prompt */}
        <div style={{ width: `${leftWidth}%` }} className="flex-shrink-0 border-r border-gray-700">
          <PromptPanel onPromptSubmit={handlePromptSubmit} />
        </div>

        {/* Resizer */}
        <div
          className={`w-1 bg-gray-700 cursor-col-resize hover:bg-blue-500 transition-colors duration-200 ${
            isResizing ? 'bg-blue-500' : ''
          }`}
          onMouseDown={startResizing}
        />

        {/* Right Panel - Code Editor/Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs - Above everything */}
          <EditorTabs activeTab={activeTab} onTabChange={handleTabChange} />
          
          {/* Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {activeTab === 'code' ? (
              <>
                {/* File Explorer */}
                <div className="w-64 border-r border-gray-700 flex-shrink-0">
                  <FileExplorer
                    files={files}
                    activeFile={activeFile}
                    onFileSelect={handleFileSelect}
                  />
                </div>
                {/* Code Editor */}
                <div className="flex-1">
                  <CodeEditor
                    activeFile={activeFile}
                    files={files}
                    onFileChange={handleFileChange}
                  />
                </div>
              </>
            ) : (
              /* Live Preview - Full Width */
              <PreviewPanel files={files} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;