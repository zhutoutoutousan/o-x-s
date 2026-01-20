import React from 'react';
import { Builder } from '@lovers-saas/builder';
import { Timeline, type TimelineEvent } from '@lovers-saas/timeline';
import { Chat } from '@lovers-saas/chat';
import { Effects } from '@lovers-saas/effects';
import { Video } from '@lovers-saas/video';
import { Legacy } from '@lovers-saas/legacy';
import type { ComponentConfig } from '@lovers-saas/builder';

const TimelineComponent: React.FC<any> = (props) => (
  <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
    <Timeline {...props} />
  </div>
);

const ChatComponent: React.FC<any> = (props) => (
  <div style={{ height: '500px' }}>
    <Chat {...props} />
  </div>
);

const EffectsComponent: React.FC<any> = (props) => (
  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
    <Effects {...props} />
  </div>
);

const VideoComponent: React.FC<any> = (props) => (
  <div style={{ padding: '20px' }}>
    <Video {...props} />
  </div>
);

const LegacyComponent: React.FC<any> = (props) => (
  <div style={{ width: '100%', minHeight: '100vh' }}>
    <Legacy {...props} />
  </div>
);

const components: ComponentConfig[] = [
  {
    type: 'timeline',
    label: 'Timeline',
    defaultProps: {
      events: [
        {
          id: '1',
          date: '2024-01-01',
          title: 'First Meeting',
          description: 'The day we first met',
          color: '#6366f1'
        }
      ],
      orientation: 'vertical'
    },
    defaultSize: { width: 600, height: 400 },
    component: TimelineComponent
  },
  {
    type: 'chat',
    label: 'Chat',
    defaultProps: {
      user1Name: 'Sue',
      user2Name: 'Owen'
    },
    defaultSize: { width: 400, height: 500 },
    component: ChatComponent
  },
  {
    type: 'effects',
    label: 'Candle & Fire Effects',
    defaultProps: {
      type: 'both',
      intensity: 1
    },
    defaultSize: { width: 800, height: 600 },
    component: EffectsComponent
  },
  {
    type: 'video',
    label: 'Video Player',
    defaultProps: {
      harryPotterStyle: true,
      src: '',
      poster: ''
    },
    defaultSize: { width: 800, height: 450 },
    component: VideoComponent
  },
  {
    type: 'legacy',
    label: 'Legacy Museum',
    defaultProps: {
      memories: [],
      viewMode: 'gallery'
    },
    defaultSize: { width: 1200, height: 800 },
    component: LegacyComponent
  }
];

function App() {
  const handleSave = (instances: any[]) => {
    console.log('Saving instances:', instances);
    localStorage.setItem('lovers-site', JSON.stringify(instances));
    alert('Site saved!');
  };

  const loadSaved = () => {
    const saved = localStorage.getItem('lovers-site');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Builder
        components={components}
        onSave={handleSave}
        initialInstances={loadSaved()}
      />
    </div>
  );
}

export default App;
