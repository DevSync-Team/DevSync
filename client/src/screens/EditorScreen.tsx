'use client'

import React, { useState } from 'react';
// 1. Importing the modal components from the TSX file
import { VersionHistoryModal, SaveSnapshotModal } from '@/components/versioncontrol/VersionControlModals';
import { Clock, Upload } from 'lucide-react';

const EditorScreen = () => {
  // 2. Declaring state to control the visibility of the two modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  // ... (Your existing editor code goes here)

  return (
    <div className="editor-layout bg-[#0d111c] min-h-screen">
      {/* Top Bar/Toolbar where the buttons likely live */}
      <header className="flex justify-end p-4 bg-[#161b2b] border-b border-gray-700">
        
        {/* Button to open Version History */}
        <button
          // 3. Seatting the state to true on click
          onClick={() => setIsHistoryOpen(true)}
          className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 mr-3 text-sm text-white transition hover:bg-gray-600"
        >
          <Clock size={16} className="mr-2" />
          Version History
        </button>

        {/* Button to open Save Snapshot Modal */}
        <button
          // 3. Setting the state to true on click
          onClick={() => setIsSaveOpen(true)}
          className="flex items-center rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-cyan-600"
        >
          <Upload size={16} className="mr-2" />
          Save Snapshot
        </button>
      </header>

      {/* Main Content (Code Editor, Preview, etc.) */}
      <main className="p-4 text-white">
        {/* ... Editor content ... */}
        <p>This is where your code editor and collaboration space would be.</p>
      </main>


      {/* 4. Modals are rendered here, conditionally based on state */}
      <VersionHistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} // Pass setter to close the modal
      />
      <SaveSnapshotModal 
        isOpen={isSaveOpen} 
        onClose={() => setIsSaveOpen(false)} // Pass setter to close the modal
      />
    </div>
  );
};

export default EditorScreen;