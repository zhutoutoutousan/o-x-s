import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BuilderCanvas } from './BuilderCanvas';
import { ComponentPalette } from './ComponentPalette';
import { PropertiesPanel } from './PropertiesPanel';
import type { ComponentConfig, ComponentInstance } from './types';

export interface BuilderProps {
  components?: ComponentConfig[];
  onSave?: (instances: ComponentInstance[]) => void;
  initialInstances?: ComponentInstance[];
}

export const Builder: React.FC<BuilderProps> = ({
  components = [],
  onSave,
  initialInstances = []
}) => {
  const [instances, setInstances] = useState<ComponentInstance[]>(initialInstances);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDrop = useCallback((component: ComponentConfig, position: { x: number; y: number }) => {
    const newInstance: ComponentInstance = {
      id: `instance-${Date.now()}`,
      type: component.type,
      position,
      props: component.defaultProps || {},
      size: component.defaultSize || { width: 200, height: 200 }
    };
    setInstances(prev => [...prev, newInstance]);
  }, []);

  const handleUpdate = useCallback((id: string, updates: Partial<ComponentInstance>) => {
    setInstances(prev => prev.map(inst => 
      inst.id === id ? { ...inst, ...updates } : inst
    ));
  }, []);

  const handleDelete = useCallback((id: string) => {
    setInstances(prev => prev.filter(inst => inst.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleSave = useCallback(() => {
    onSave?.(instances);
  }, [instances, onSave]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui' }}>
        <ComponentPalette components={components} />
        <BuilderCanvas
          instances={instances}
          onDrop={handleDrop}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <PropertiesPanel
          instance={instances.find(inst => inst.id === selectedId)}
          onUpdate={(updates) => selectedId && handleUpdate(selectedId, updates)}
        />
        <button
          onClick={handleSave}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            padding: '10px 20px',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            zIndex: 1000
          }}
        >
          Save
        </button>
      </div>
    </DndProvider>
  );
};

export * from './types';
export * from './BuilderCanvas';
export * from './ComponentPalette';
export * from './PropertiesPanel';
