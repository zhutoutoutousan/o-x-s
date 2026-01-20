import React from 'react';
import './Timeline.css';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  color?: string;
}

export interface TimelineProps {
  events: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  events,
  orientation = 'vertical',
  className = ''
}) => {
  return (
    <div className={`timeline-container timeline-${orientation} ${className}`}>
      {events.map((event, index) => (
        <div key={event.id} className="timeline-item">
          <div className="timeline-marker" style={{ background: event.color || '#6366f1' }}>
            <span className="timeline-date">{event.date}</span>
          </div>
          <div className="timeline-content">
            {event.image && (
              <img src={event.image} alt={event.title} className="timeline-image" />
            )}
            <h3 className="timeline-title">{event.title}</h3>
            <p className="timeline-description">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
