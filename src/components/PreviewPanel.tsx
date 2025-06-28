import React, { useMemo } from 'react';
import { FileNode } from '../types';

interface PreviewPanelProps {
  files: FileNode[];
}

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

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ files }) => {
  const previewContent = useMemo(() => {
    const htmlContent = findFileContent(files, 'index.html');
    const appContent = findFileContent(files, 'src/App.tsx');
    const mainContent = findFileContent(files, 'src/main.tsx');
    const cssContent = findFileContent(files, 'src/index.css');
    
    // Extract the App component content and convert it to a simple preview
    const appMatch = appContent.match(/return\s*\(([\s\S]*?)\);/);
    let jsxContent = '';
    
    if (appMatch) {
      jsxContent = appMatch[1].trim();
      // Remove className attributes for basic preview
      jsxContent = jsxContent.replace(/className="[^"]*"/g, 'style="padding: 20px; font-family: system-ui, sans-serif;"');
      // Convert JSX to HTML-like structure
      jsxContent = jsxContent.replace(/<(\w+)([^>]*)>/g, '<$1$2>');
    } else {
      jsxContent = `
        <div style="padding: 40px; text-align: center; font-family: system-ui, sans-serif;">
          <h1 style="color: #1f2937; margin-bottom: 16px;">Welcome to Your App</h1>
          <p style="color: #6b7280;">Start building something amazing!</p>
        </div>
      `;
    }

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Live Preview</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f9fafb;
            min-height: 100vh;
          }
          .preview-container {
            width: 100%;
            height: 100vh;
            overflow: auto;
          }
          /* Basic Tailwind-like styles */
          .min-h-screen { min-height: 100vh; }
          .bg-gray-100 { background-color: #f3f4f6; }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .text-center { text-align: center; }
          .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
          .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .font-bold { font-weight: 700; }
          .text-gray-900 { color: #111827; }
          .text-gray-600 { color: #4b5563; }
          .mb-4 { margin-bottom: 1rem; }
          .px-4 { padding-left: 1rem; padding-right: 1rem; }
          .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
          .rounded-lg { border-radius: 0.5rem; }
          .bg-blue-600 { background-color: #2563eb; }
          .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
          .text-white { color: #ffffff; }
          .transition-all { transition: all 0.15s ease-in-out; }
          .cursor-pointer { cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="preview-container">
          ${jsxContent}
        </div>
      </body>
      </html>
    `;
  }, [files]);

  return (
    <div className="h-full bg-white">
      <iframe
        srcDoc={previewContent}
        className="w-full h-full border-0"
        title="Live Preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};