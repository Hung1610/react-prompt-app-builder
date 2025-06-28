import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  FileText,
  Braces,
  Settings,
  Image
} from 'lucide-react';
import { FileNode } from '../types';

interface FileExplorerProps {
  files: FileNode[];
  activeFile?: string;
  onFileSelect: (filePath: string) => void;
}

const FileIcon: React.FC<{ fileName: string; isFolder: boolean; isOpen?: boolean }> = ({ 
  fileName, 
  isFolder, 
  isOpen 
}) => {
  if (isFolder) {
    return isOpen ? 
      <FolderOpen className="w-4 h-4 text-blue-400" /> : 
      <Folder className="w-4 h-4 text-blue-400" />;
  }

  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return <Braces className="w-4 h-4 text-blue-400" />;
    case 'json':
      return <Settings className="w-4 h-4 text-yellow-400" />;
    case 'css':
    case 'scss':
      return <FileText className="w-4 h-4 text-green-400" />;
    case 'html':
      return <FileText className="w-4 h-4 text-orange-400" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
      return <Image className="w-4 h-4 text-purple-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
};

const FileTreeNode: React.FC<{
  node: FileNode;
  level: number;
  activeFile?: string;
  onFileSelect: (filePath: string) => void;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
}> = ({ node, level, activeFile, onFileSelect, expandedFolders, toggleFolder }) => {
  const isExpanded = expandedFolders.has(node.path);
  const isActive = activeFile === node.path;

  const handleClick = () => {
    if (node.type === 'folder') {
      toggleFolder(node.path);
    } else {
      onFileSelect(node.path);
    }
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-gray-700 rounded transition-colors duration-150 ${
          isActive ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <div className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </div>
        )}
        {node.type === 'file' && <div className="w-4" />}
        <FileIcon 
          fileName={node.name} 
          isFolder={node.type === 'folder'} 
          isOpen={isExpanded}
        />
        <span className="text-sm font-medium">{node.name}</span>
      </div>
      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              level={level + 1}
              activeFile={activeFile}
              onFileSelect={onFileSelect}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, activeFile, onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  return (
    <div className="h-full bg-gray-800 text-white">
      <div className="p-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          Explorer
        </h3>
      </div>
      <div className="p-2 overflow-y-auto">
        {files.map((node) => (
          <FileTreeNode
            key={node.path}
            node={node}
            level={0}
            activeFile={activeFile}
            onFileSelect={onFileSelect}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
          />
        ))}
      </div>
    </div>
  );
};