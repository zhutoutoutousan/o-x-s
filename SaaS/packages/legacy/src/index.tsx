import React from 'react';
import { MemoryUpload } from './MemoryUpload';
import { MemoryGallery } from './MemoryGallery';
import { LifeTimeline } from './LifeTimeline';
import { StoryEntry } from './StoryEntry';
import './Legacy.css';

export interface Memory {
  id: string;
  type: 'photo' | 'video' | 'story' | 'audio';
  title: string;
  description?: string;
  date?: string;
  fileUrl?: string;
  content?: string;
  tags?: string[];
}

export interface LegacyProps {
  memories?: Memory[];
  onMemoryAdd?: (memory: Memory) => void;
  onMemoryDelete?: (id: string) => void;
  viewMode?: 'gallery' | 'timeline' | 'upload';
  className?: string;
}

export const Legacy: React.FC<LegacyProps> = ({
  memories = [],
  onMemoryAdd,
  onMemoryDelete,
  viewMode = 'gallery',
  className = ''
}) => {
  const [currentView, setCurrentView] = React.useState<'gallery' | 'timeline' | 'upload' | 'story'>(viewMode as any);

  return (
    <div className={`legacy-container ${className}`}>
      <div className="legacy-header">
        <h2 className="legacy-title">My Life Museum</h2>
        <div className="legacy-nav">
          <button
            className={`nav-button ${currentView === 'gallery' ? 'active' : ''}`}
            onClick={() => setCurrentView('gallery')}
          >
            📸 Gallery
          </button>
          <button
            className={`nav-button ${currentView === 'timeline' ? 'active' : ''}`}
            onClick={() => setCurrentView('timeline')}
          >
            📅 Timeline
          </button>
          <button
            className={`nav-button ${currentView === 'upload' ? 'active' : ''}`}
            onClick={() => setCurrentView('upload')}
          >
            ➕ Add Photo/Video
          </button>
          <button
            className={`nav-button ${currentView === 'story' ? 'active' : ''}`}
            onClick={() => setCurrentView('story')}
          >
            ✍️ Tell a Story
          </button>
        </div>
      </div>

      <div className="legacy-content">
        {currentView === 'gallery' && (
          <MemoryGallery
            memories={memories}
            onDelete={onMemoryDelete}
          />
        )}
        {currentView === 'timeline' && (
          <LifeTimeline memories={memories} />
        )}
        {currentView === 'upload' && (
          <MemoryUpload onUpload={onMemoryAdd} />
        )}
        {currentView === 'story' && (
          <StoryEntry onSave={onMemoryAdd} />
        )}
      </div>
    </div>
  );
};

export { MemoryUpload } from './MemoryUpload';
export { MemoryGallery } from './MemoryGallery';
export { LifeTimeline } from './LifeTimeline';
export { StoryEntry } from './StoryEntry';
