import React, { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import type { ComponentInstance, ComponentConfig } from './types';

interface BuilderCanvasProps {
  instances: ComponentInstance[];
  onDrop: (component: ComponentConfig, position: { x: number; y: number }) => void;
  onUpdate: (id: string, updates: Partial<ComponentInstance>) => void;
  onDelete: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  instances,
  onDrop,
  onUpdate,
  onDelete,
  selectedId,
  onSelect
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item: ComponentConfig, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const canvasRect = (monitor.getDropResult() as any)?.canvasRect || { left: 0, top: 0 };
        onDrop(item, {
          x: offset.x - canvasRect.left,
          y: offset.y - canvasRect.top
        });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const handleInstanceClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onSelect(id);
  }, [onSelect]);

  const handleCanvasClick = useCallback(() => {
    onSelect(null);
  }, [onSelect]);

  return (
    <div
      ref={drop}
      onClick={handleCanvasClick}
      style={{
        flex: 1,
        background: isOver ? '#f0f9ff' : '#ffffff',
        position: 'relative',
        overflow: 'auto',
        transition: 'background 0.2s'
      }}
    >
      {instances.map(instance => (
        <div
          key={instance.id}
          onClick={(e) => handleInstanceClick(e, instance.id)}
          style={{
            position: 'absolute',
            left: `${instance.position.x}px`,
            top: `${instance.position.y}px`,
            width: `${instance.size.width}px`,
            height: `${instance.size.height}px`,
            border: selectedId === instance.id ? '2px solid #6366f1' : '1px dashed #ccc',
            background: selectedId === instance.id ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
            cursor: 'move',
            padding: '8px',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ fontSize: '12px', color: '#666' }}>{instance.type}</div>
          {selectedId === instance.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(instance.id);
              }}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}
      {instances.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#999',
          fontSize: '18px'
        }}>
          Drag components here to build your site
        </div>
      )}
    </div>
  );
};
