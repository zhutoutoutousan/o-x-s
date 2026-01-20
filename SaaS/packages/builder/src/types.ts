export interface ComponentConfig {
  type: string;
  label: string;
  icon?: string;
  defaultProps?: Record<string, any>;
  defaultSize?: { width: number; height: number };
  component: React.ComponentType<any>;
}

export interface ComponentInstance {
  id: string;
  type: string;
  position: { x: number; y: number };
  props: Record<string, any>;
  size: { width: number; height: number };
}
