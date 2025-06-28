import React from 'react';
import { Code, Eye } from 'lucide-react';

interface EditorTabsProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-gray-800 border-b border-gray-700">
      <button
        onClick={() => onTabChange('code')}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
          activeTab === 'code'
            ? 'bg-gray-900 text-white border-b-2 border-blue-500'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
      >
        <Code className="w-4 h-4" />
        Code Editor
      </button>
      <button
        onClick={() => onTabChange('preview')}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
          activeTab === 'preview'
            ? 'bg-gray-900 text-white border-b-2 border-blue-500'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
      >
        <Eye className="w-4 h-4" />
        Live Preview
      </button>
    </div>
  );
};