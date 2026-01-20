import React from 'react';
import { useDrag } from 'react-dnd';
import type { ComponentConfig } from './types';

interface ComponentPaletteProps {
  components: ComponentConfig[];
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ components }) => {
  return (
    <div style={{
      width: '250px',
      background: '#f8f9fa',
      borderRight: '1px solid #e0e0e0',
      padding: '20px',
      overflowY: 'auto'
    }}>
      <h2 style={{ marginTop: 0, fontSize: '18px', fontWeight: 600 }}>Components</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {components.map(component => (
          <DraggableComponent key={component.type} component={component} />
        ))}
      </div>
    </div>
  );
};

const DraggableComponent: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'component',
    item: component,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: '12px',
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        transition: 'all 0.2s'
      }}
    >
      <div style={{ fontWeight: 500, marginBottom: '4px' }}>{component.label}</div>
      <div style={{ fontSize: '12px', color: '#666' }}>{component.type}</div>
    </div>
  );
};
