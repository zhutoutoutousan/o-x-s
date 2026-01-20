import React from 'react';
import { motion } from 'framer-motion';
import { getResponsiveImageUrl } from '../utils/cloudinary';
import './Timeline.css';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  color?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="timeline-container">
      <div className="timeline-line"></div>
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.2 }}
          className="timeline-item"
        >
          <div
            className="timeline-marker"
            style={{ background: event.color || '#d4af37' }}
          >
            <span className="timeline-date">{event.date}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="timeline-content"
          >
            {event.image && (
              <img 
                src={event.image.startsWith('http') 
                  ? event.image 
                  : getResponsiveImageUrl(event.image, 800)
                } 
                alt={event.title} 
                className="timeline-image" 
                loading="lazy"
              />
            )}
            <h3 className="timeline-title">{event.title}</h3>
            <p className="timeline-description">{event.description}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};
