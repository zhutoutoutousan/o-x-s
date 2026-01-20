# Legacy Museum Package

A comprehensive component package for creating digital legacy museums, designed for elderly users to preserve and share their life stories, photos, videos, and memories.

## Features

- 📸 **Photo & Video Upload**: Easy-to-use interface for uploading memories
- ✍️ **Story Entry**: Simple form for writing and preserving life stories
- 📅 **Life Timeline**: Chronological view of memories organized by year
- 🖼️ **Gallery View**: Beautiful grid layout to browse all memories
- 📱 **Mobile-Friendly**: Large buttons and text optimized for elderly users
- 🎨 **Accessible Design**: High contrast, clear typography, intuitive navigation

## Components

### Legacy
Main component that provides navigation between different views:
- Gallery: Browse all memories in a grid
- Timeline: View memories chronologically
- Upload: Add photos and videos
- Story: Write and save life stories

### MemoryUpload
Component for uploading photos and videos with:
- Drag-and-drop support
- Preview before upload
- Title, description, and date fields
- Mobile-optimized interface

### MemoryGallery
Gallery view with:
- Filter by type (photos, videos, stories)
- Modal view for full-size viewing
- Delete functionality
- Responsive grid layout

### LifeTimeline
Chronological timeline showing:
- Memories grouped by year
- Visual timeline with markers
- Memory cards with details
- Scrollable interface

### StoryEntry
Form for writing life stories with:
- Large text areas for comfortable writing
- Character count
- Date and tag support
- Helpful tips for writing

## Usage

```tsx
import { Legacy } from '@lovers-saas/legacy';

function MyApp() {
  const [memories, setMemories] = useState([]);

  const handleMemoryAdd = (memory) => {
    setMemories([...memories, memory]);
  };

  return (
    <Legacy
      memories={memories}
      onMemoryAdd={handleMemoryAdd}
      viewMode="gallery"
    />
  );
}
```

## Design Philosophy

This package is specifically designed for elderly users with:
- **Large Text**: Minimum 18px font size
- **Big Buttons**: Easy-to-click interface elements
- **Clear Navigation**: Simple, intuitive menu system
- **High Contrast**: Readable color schemes
- **Touch-Friendly**: Optimized for mobile and tablet use
- **No Jargon**: Plain language throughout

## Memory Types

- **Photo**: Image files (JPG, PNG, etc.)
- **Video**: Video files (MP4, MOV, etc.)
- **Story**: Text-based memories and life stories
- **Audio**: Audio recordings (future feature)

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Color-blind friendly design
- Responsive for all screen sizes

## Future Enhancements

- Audio recording support
- Family sharing features
- Print/export functionality
- Cloud storage integration
- Voice-to-text for stories
- Photo organization by tags
- Search functionality
