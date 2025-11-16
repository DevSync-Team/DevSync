'use client';
import React, { useState } from 'react';
import { X, User, Clock, FileText, Upload } from 'lucide-react';

// Define the type for a single snapshot object
interface Snapshot {
    id: number;
    user: string;
    isCurrent: boolean;
    message: string;
    date: string;
    timeAgo: string;
    files: number;
}

// Mock data (now typed)
const mockSnapshots: Snapshot[] = [
  {
    id: 1,
    user: 'Tidding Ramsey',
    isCurrent: true,
    message: 'Initial project setup',
    date: 'Nov 15, 08:28 AM',
    timeAgo: '1 hour ago',
    files: 1,
  },
  {
    id: 2,
    user: 'Ako Ruth',
    isCurrent: false,
    message: 'Implemented dark mode styles for auth pages.',
    date: 'Nov 15, 07:15 AM',
    timeAgo: '2 hours ago',
    files: 2,
  },
  {
    id: 3,
    user: 'Tidding Ramsey',
    isCurrent: false,
    message: 'Added basic login and signup components.',
    date: 'Nov 15, 06:00 AM',
    timeAgo: '3 hours ago',
    files: 2,
  },
];

// Define the common props interface for both modals
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- 1. Version History Modal Component ---
// Displays the history of saved versions (Code Snapshots).
export const VersionHistoryModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    // Fixed overlay backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-[#161b2b] p-6 shadow-2xl transition-all duration-300 transform scale-100 opacity-100">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Version History</h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-700 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Code Snapshots Header */}
        <div className="text-sm">
          <h3 className="mb-4 flex justify-between text-base font-medium text-gray-300">
            Code Snapshots
            <span className="text-gray-500 font-normal">
                {mockSnapshots.length} snapshot{mockSnapshots.length !== 1 ? 's' : ''}
            </span>
          </h3>

          {/* Snapshot List Container */}
          <div className="max-h-80 space-y-3 overflow-y-auto pr-2">
            {mockSnapshots.map((snapshot: Snapshot) => (
              <div
                key={snapshot.id}
                className={`flex items-start rounded-lg p-3 transition duration-200 cursor-pointer border ${
                  snapshot.isCurrent
                    ? 'bg-blue-900/50 border-blue-600'
                    : 'bg-[#1e2535] border-transparent hover:bg-[#252c40]'
                }`}
              >
                {/* User Icon/Avatar Placeholder */}
                <div className="flex-shrink-0 pt-1">
                  <User size={20} className="text-blue-400" />
                </div>
                
                <div className="ml-3 flex-grow">
                  {/* User & Status */}
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-white">{snapshot.user}</span>
                    {snapshot.isCurrent && (
                      <span className="ml-2 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
                        Current
                      </span>
                    )}
                  </div>
                  
                  {/* Message */}
                  <p className="mt-0.5 text-sm text-gray-300 line-clamp-2">{snapshot.message}</p>

                  {/* Metadata (Date/Time Ago/Files) */}
                  <div className="mt-1 flex space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>{snapshot.date} • {snapshot.timeAgo}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText size={12} className="mr-1" />
                      <span>{snapshot.files} file{snapshot.files !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 2. Save Code Snapshot Modal Component ---
// Provides the input field for adding a description and saving a new version.
export const SaveSnapshotModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [snapshotMessage, setSnapshotMessage] = useState('');
  const MAX_CHARS = 200;

  if (!isOpen) return null;

  const handleSave = () => {
    // API call to save snapshot goes here
    console.log('Saving Snapshot with message:', snapshotMessage);
    
    setSnapshotMessage('');
    onClose();
  };

  return (
    // Fixed overlay backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-lg bg-[#161b2b] p-6 shadow-2xl transition-all duration-300 transform scale-100 opacity-100">
        
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Save Code Snapshot</h2>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 text-gray-400 transition hover:bg-gray-700 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Snapshot Message Input */}
        <div className="mb-6">
          <label htmlFor="snapshot-msg" className="block text-sm font-medium text-gray-300 mb-2">
            Snapshot Message
          </label>
          <textarea
            id="snapshot-msg"
            rows={3}
            value={snapshotMessage}
            onChange={(e) => setSnapshotMessage(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Describe what changed in this version..."
            className="w-full resize-none rounded-md border border-gray-700 bg-[#0d111c] p-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
          {/* Character counter */}
          <p className="mt-1 text-right text-xs text-gray-500">
            {snapshotMessage.length}/{MAX_CHARS} characters
          </p>
        </div>

        {/* Actions (Cancel and Save Snapshot button) */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-400 transition hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={snapshotMessage.trim().length === 0}
            className="rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-cyan-600"
          >
            Save Snapshot
          </button>
        </div>
      </div>
    </div>
  );
};