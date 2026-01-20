import React, { useState } from 'react';
import { Memory } from './index';
import './MemoryGallery.css';

interface MemoryGalleryProps {
  memories: Memory[];
  onDelete?: (id: string) => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ memories, onDelete }) => {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'story'>('all');

  const filteredMemories = memories.filter(m => 
    filter === 'all' || m.type === filter
  );

  const openModal = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const closeModal = () => {
    setSelectedMemory(null);
  };

  if (memories.length === 0) {
    return (
      <div className="gallery-empty">
        <div className="empty-icon">📸</div>
        <h3 className="empty-title">No memories yet</h3>
        <p className="empty-text">Start adding your life stories and photos!</p>
      </div>
    );
  }

  return (
    <div className="memory-gallery">
      <div className="gallery-filters">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({memories.length})
        </button>
        <button
          className={`filter-button ${filter === 'photo' ? 'active' : ''}`}
          onClick={() => setFilter('photo')}
        >
          📷 Photos ({memories.filter(m => m.type === 'photo').length})
        </button>
        <button
          className={`filter-button ${filter === 'video' ? 'active' : ''}`}
          onClick={() => setFilter('video')}
        >
          🎥 Videos ({memories.filter(m => m.type === 'video').length})
        </button>
        <button
          className={`filter-button ${filter === 'story' ? 'active' : ''}`}
          onClick={() => setFilter('story')}
        >
          ✍️ Stories ({memories.filter(m => m.type === 'story').length})
        </button>
      </div>

      <div className="gallery-grid">
        {filteredMemories.map(memory => (
          <div
            key={memory.id}
            className="gallery-item"
            onClick={() => openModal(memory)}
          >
            {memory.type === 'photo' && memory.fileUrl && (
              <img src={memory.fileUrl} alt={memory.title} className="gallery-image" />
            )}
            {memory.type === 'video' && memory.fileUrl && (
              <div className="gallery-video-container">
                <video src={memory.fileUrl} className="gallery-video" />
                <div className="video-play-icon">▶</div>
              </div>
            )}
            {memory.type === 'story' && (
              <div className="gallery-story">
                <div className="story-icon">✍️</div>
                <h4 className="story-title">{memory.title}</h4>
              </div>
            )}
            <div className="gallery-overlay">
              <h4 className="gallery-item-title">{memory.title}</h4>
              {memory.date && (
                <p className="gallery-item-date">{new Date(memory.date).toLocaleDateString()}</p>
              )}
            </div>
            {onDelete && (
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this memory?')) {
                    onDelete(memory.id);
                  }
                }}
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedMemory && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>✕</button>
            <h2 className="modal-title">{selectedMemory.title}</h2>
            {selectedMemory.date && (
              <p className="modal-date">{new Date(selectedMemory.date).toLocaleDateString()}</p>
            )}
            {selectedMemory.type === 'photo' && selectedMemory.fileUrl && (
              <img src={selectedMemory.fileUrl} alt={selectedMemory.title} className="modal-image" />
            )}
            {selectedMemory.type === 'video' && selectedMemory.fileUrl && (
              <video src={selectedMemory.fileUrl} controls className="modal-video" />
            )}
            {selectedMemory.description && (
              <p className="modal-description">{selectedMemory.description}</p>
            )}
            {selectedMemory.type === 'story' && selectedMemory.content && (
              <div className="modal-story">
                <p className="story-content">{selectedMemory.content}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
