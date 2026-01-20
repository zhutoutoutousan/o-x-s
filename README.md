# O-X-S - Lovers Platform

A comprehensive platform for creating beautiful lover's sites, featuring both a standardized SaaS solution and a free-hand custom design approach.

## Structure

```
o-x-s/
├── SaaS/          # Monorepo SaaS solution with drag-and-drop builder
├── xoxoos/        # Free-hand custom site for Sue & Owen
└── mobile-app/    # Mobile instant messaging app with AI assistant
```

## SaaS Solution

A low-code drag-and-drop platform that allows users to build custom lover's sites with reusable components.

**Location**: `SaaS/`

**Features**:
- Drag-and-drop builder interface
- Component library (Timeline, Chat, Effects, Video, Legacy Museum)
- Properties panel for customization
- Save/load functionality
- Legacy museum for elderly users to preserve life stories

**Getting Started**:
```bash
cd SaaS
pnpm install
pnpm dev
```

See [SaaS/README.md](./SaaS/README.md) for more details.

## XOXOOS - Free-Hand Site

A beautifully designed, custom site for Sue and Owen with maximum design freedom.

**Location**: `xoxoos/`

**Features**:
- Magical timeline of your journey
- Sweet moments chat interface
- Harry Potter-style video player
- Animated candle wall with fire effects
- Romantic, enchanting aesthetic

**Getting Started**:
```bash
cd xoxoos
pnpm install
pnpm dev
```

See [xoxoos/README.md](./xoxoos/README.md) for more details.

## Mobile App - Love AI Messenger

A mobile instant messaging application with AI capabilities that learns from conversations and can continue relationships when needed.

**Location**: `mobile-app/`

**Features**:
- Instant messaging interface
- AI learning from conversations
- Personality capture and memory system
- AI assistant mode
- Active/proactive messaging

**Getting Started**:
```bash
cd mobile-app
npm install
npm start
```

See [mobile-app/README.md](./mobile-app/README.md) for more details.

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations (xoxoos)
- **React DnD** - Drag and drop (SaaS)
- **Canvas API** - Visual effects
- **React Native** - Mobile framework (mobile-app)
- **Expo** - Mobile development platform
- **OpenAI API** - AI processing (optional, mobile-app backend)

## License

See [LICENSE](./LICENSE) file.
