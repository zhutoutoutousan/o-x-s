import React, { useState } from 'react';
import { Memory } from './index';
import './StoryEntry.css';

interface StoryEntryProps {
  onSave?: (memory: Memory) => void;
}

export const StoryEntry: React.FC<StoryEntryProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState('');

  const handleSave = () => {
    if (!title || !content) {
      alert('Please enter a title and story content');
      return;
    }

    const memory: Memory = {
      id: `story-${Date.now()}`,
      type: 'story',
      title,
      content,
      date: date || new Date().toISOString().split('T')[0],
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
    };

    onSave?.(memory);

    // Reset form
    setTitle('');
    setContent('');
    setDate('');
    setTags('');
    alert('Story saved successfully!');
  };

  return (
    <div className="story-entry">
      <div className="story-card">
        <h3 className="story-title">Tell Your Story</h3>
        <p className="story-subtitle">Share your memories, experiences, and life lessons</p>

        <div className="story-form">
          <div className="form-group">
            <label className="form-label">Story Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="e.g., My First Day at School"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Story *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea story-textarea"
              placeholder="Write your story here... Share your memories, experiences, thoughts, and life lessons. There's no limit - take your time and tell it your way."
              rows={12}
            />
            <p className="character-count">{content.length} characters</p>
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="form-input"
              placeholder="e.g., family, childhood, work, travel"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!title || !content}
            className="save-button"
          >
            Save Story
          </button>
        </div>

        <div className="story-tips">
          <h4 className="tips-title">💡 Tips for Writing Your Story</h4>
          <ul className="tips-list">
            <li>Write from the heart - your authentic voice is what matters</li>
            <li>Include details that help paint the picture</li>
            <li>Share your feelings and thoughts, not just facts</li>
            <li>Don't worry about perfect grammar - your story is what's important</li>
            <li>You can always come back and add more later</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
