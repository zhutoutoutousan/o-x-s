import React from 'react';
import { Memory } from './index';
import './LifeTimeline.css';

interface LifeTimelineProps {
  memories: Memory[];
}

export const LifeTimeline: React.FC<LifeTimelineProps> = ({ memories }) => {
  // Sort memories by date
  const sortedMemories = [...memories].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateA - dateB;
  });

  const getYear = (date?: string) => {
    if (!date) return 'Unknown';
    return new Date(date).getFullYear();
  };

  const groupByYear = () => {
    const grouped: { [year: string]: Memory[] } = {};
    sortedMemories.forEach(memory => {
      const year = getYear(memory.date);
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(memory);
    });
    return grouped;
  };

  const groupedMemories = groupByYear();
  const years = Object.keys(groupedMemories).sort((a, b) => {
    if (a === 'Unknown') return 1;
    if (b === 'Unknown') return -1;
    return parseInt(a) - parseInt(b);
  });

  if (memories.length === 0) {
    return (
      <div className="timeline-empty">
        <div className="empty-icon">📅</div>
        <h3 className="empty-title">No timeline yet</h3>
        <p className="empty-text">Add memories with dates to see your life timeline!</p>
      </div>
    );
  }

  return (
    <div className="life-timeline">
      <div className="timeline-line"></div>
      {years.map((year, yearIndex) => (
        <div key={year} className="timeline-year-section">
          <div className="year-marker">
            <div className="year-circle"></div>
            <h3 className="year-label">{year}</h3>
          </div>
          <div className="year-memories">
            {groupedMemories[year].map((memory, index) => (
              <div key={memory.id} className="timeline-memory">
                <div className="memory-marker"></div>
                <div className="memory-card">
                  <div className="memory-header">
                    <h4 className="memory-title">{memory.title}</h4>
                    <span className="memory-type-icon">
                      {memory.type === 'photo' && '📷'}
                      {memory.type === 'video' && '🎥'}
                      {memory.type === 'story' && '✍️'}
                    </span>
                  </div>
                  {memory.date && (
                    <p className="memory-date">
                      {new Date(memory.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                  {memory.description && (
                    <p className="memory-description">{memory.description}</p>
                  )}
                  {memory.type === 'photo' && memory.fileUrl && (
                    <img src={memory.fileUrl} alt={memory.title} className="memory-thumbnail" />
                  )}
                  {memory.type === 'story' && memory.content && (
                    <div className="memory-story-preview">
                      <p>{memory.content.substring(0, 150)}...</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
