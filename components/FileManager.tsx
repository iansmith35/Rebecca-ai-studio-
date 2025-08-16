
import React, { useState, useCallback } from 'react';
import { Icon } from './Icon';

type FileItem = {
    id: string;
    name: string;
    type: 'folder' | 'image' | 'document';
    size: string;
    modified: string;
};

const mockFiles: FileItem[] = [
    { id: '1', name: 'Brand Assets', type: 'folder', size: '3.2 GB', modified: '2024-07-30' },
    { id: '2', name: 'Marketing Materials', type: 'folder', size: '1.5 GB', modified: '2024-07-29' },
    { id: '3', name: 'Invoices', type: 'folder', size: '450 MB', modified: '2024-07-28' },
    { id: '4', name: 'Case Files', type: 'folder', size: '8.9 GB', modified: '2024-07-27' },
    { id: '5', name: 'logo_final_v2.png', type: 'image', size: '1.2 MB', modified: '2024-07-30' },
    { id: '6', name: 'Q3_Strategy.pdf', type: 'document', size: '2.5 MB', modified: '2024-07-25' },
];

const fileTypeIcons = {
    folder: 'folder',
    image: 'image',
    document: 'file-text'
}

export const FileManager: React.FC = () => {
    const [files, setFiles] = useState<FileItem[]>(mockFiles);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        // A real implementation would handle file uploads here
        alert(`${e.dataTransfer.files.length} file(s) dropped! (Upload not implemented in demo)`);
    }, []);


    return (
        <div className="p-6 h-full flex flex-col text-gray-200">
             <h1 className="text-xl font-bold text-white mb-6">File Manager</h1>
             <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 bg-gray-900/50 rounded-lg p-4 flex flex-col">
                     <h2 className="text-sm font-semibold text-white mb-4">Folders</h2>
                     <nav className="space-y-1">
                        {mockFiles.filter(f => f.type === 'folder').map(folder => (
                             <a key={folder.id} href="#" onClick={e => e.preventDefault()} className="flex items-center gap-3 p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white">
                                <Icon name="folder" className="w-5 h-5 text-indigo-400"/>
                                <span className="text-sm">{folder.name}</span>
                            </a>
                        ))}
                     </nav>
                </div>

                {/* Main Content */}
                <div className="w-3/4 flex flex-col">
                    <div className="mb-4">
                        <input 
                            type="search"
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    
                    <div className="flex-1 bg-gray-900/50 rounded-lg overflow-y-auto">
                        <div className="p-4">
                            {/* Header */}
                            <div className="grid grid-cols-12 gap-4 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-700/50 pb-3 mb-2">
                                <div className="col-span-6">Name</div>
                                <div className="col-span-3">Date Modified</div>
                                <div className="col-span-3">File Size</div>
                            </div>
                            {/* File List */}
                            <div className="space-y-1">
                                {filteredFiles.map(file => (
                                    <div key={file.id} className="grid grid-cols-12 gap-4 items-center p-2 rounded-md hover:bg-gray-800/50 cursor-pointer">
                                        <div className="col-span-6 flex items-center gap-3">
                                            <Icon name={fileTypeIcons[file.type]} className="w-5 h-5 text-gray-400" />
                                            <span className="font-medium text-white">{file.name}</span>
                                        </div>
                                        <div className="col-span-3 text-sm text-gray-400">{file.modified}</div>
                                        <div className="col-span-3 text-sm text-gray-400">{file.size}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`mt-4 p-6 border-2 border-dashed rounded-lg text-center transition-colors ${isDragging ? 'border-indigo-500 bg-indigo-900/20' : 'border-gray-600'}`}
                    >
                        <p className="text-gray-400">Drag & Drop files here to upload</p>
                    </div>
                </div>

             </div>
        </div>
    );
};
