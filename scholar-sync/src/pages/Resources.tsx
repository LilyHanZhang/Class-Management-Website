import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import type { DocFile } from '../context/AppContext';

export const Resources = () => {
    const { documents, addDocument, deleteDocument } = useApp();
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = (file: File) => {
        // Read file as Base64 to persist across sessions
        const reader = new FileReader();
        reader.onloadend = () => {
             const newDoc: DocFile = {
                id: Date.now().toString(),
                name: file.name,
                url: reader.result as string, // Store Base64 string
                type: file.type,
                size: file.size,
                uploadDate: new Date().toLocaleDateString()
            };
            addDocument(newDoc);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleDeleteDocument = (id: string) => {
        if (confirm('Are you sure you want to delete this document?')) {
            deleteDocument(id);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Resources</h2>

            {/* Upload Area */}
            <div 
                className={clsx(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                    isDragging 
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                        : "border-gray-300 hover:border-blue-400 bg-white dark:bg-gray-800 dark:border-gray-700"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input 
                    type="file" 
                    id="file-upload" 
                    className="hidden" 
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                        <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            PDF, Word, or any assignment materials
                        </p>
                    </div>
                </div>
            </div>

            {/* Documents List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-800 dark:text-white">Uploaded Documents</h3>
                </div>
                {documents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No documents uploaded yet.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {documents.map((doc) => (
                            <li key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                        <FileText className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatSize(doc.size)} • {doc.uploadDate}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDeleteDocument(doc.id)}
                                        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                    <a 
                                        href={doc.url} 
                                        download={doc.name}
                                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                        title="Download"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Download size={20} />
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
