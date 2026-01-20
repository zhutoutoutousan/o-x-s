import React from 'react';
import type { ComponentInstance } from './types';

interface PropertiesPanelProps {
  instance: ComponentInstance | undefined;
  onUpdate: (updates: Partial<ComponentInstance>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ instance, onUpdate }) => {
  if (!instance) {
    return (
      <div style={{
        width: '300px',
        background: '#f8f9fa',
        borderLeft: '1px solid #e0e0e0',
        padding: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>Properties</h3>
        <p style={{ color: '#999' }}>Select a component to edit</p>
      </div>
    );
  }

  return (
    <div style={{
      width: '300px',
      background: '#f8f9fa',
      borderLeft: '1px solid #e0e0e0',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <h3 style={{ marginTop: 0 }}>Properties</h3>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Position X</label>
        <input
          type="number"
          value={instance.position.x}
          onChange={(e) => onUpdate({ position: { ...instance.position, x: Number(e.target.value) } })}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Position Y</label>
        <input
          type="number"
          value={instance.position.y}
          onChange={(e) => onUpdate({ position: { ...instance.position, y: Number(e.target.value) } })}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Width</label>
        <input
          type="number"
          value={instance.size.width}
          onChange={(e) => onUpdate({ size: { ...instance.size, width: Number(e.target.value) } })}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Height</label>
        <input
          type="number"
          value={instance.size.height}
          onChange={(e) => onUpdate({ size: { ...instance.size, height: Number(e.target.value) } })}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>
    </div>
  );
};
