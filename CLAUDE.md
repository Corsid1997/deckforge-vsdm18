# CLAUDE.md — DeckForge VSD M18 App Build Instructions

## Project Overview
Build a full-stack web app called **DeckForge** — a browser-based macro pad controller GUI for the **VSD Inside M18 / Mirabox M18 Stream Deck** (18-button device).

This app is a **React + TypeScript + Vite** frontend (in `packages/frontend`) with a **Node.js bridge** (in `packages/bridge`) that communicates with the M18 device via **WebHID** or **node-hid**.

Reference UI: https://lovable.dev/projects/e16c3ebd-806a-4619-9321-414a7548ba9c

---

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Zustand
- **Bridge:** Node.js 20+, WebSocket server (ws), node-hid
- **Storage:** localStorage for profiles/config
- **Monorepo:** pnpm workspaces with `packages/frontend` and `packages/bridge`

---

## Repository Structure

```
deckforge-vsdm18/
├── CLAUDE.md
├── package.json               (pnpm workspace root)
├── pnpm-workspace.yaml
├── packages/
│   ├── frontend/
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── index.html
│   │   ├── tailwind.config.js
│   │   ├── postcss.config.js
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── index.css
│   │       ├── types/index.ts
│   │       ├── store/useDeckStore.ts
│   │       ├── hooks/useBridge.ts
│   │       ├── hooks/useShortcuts.ts
│   │       ├── components/TopBar.tsx
│   │       ├── components/ButtonGrid.tsx
│   │       ├── components/MacroButton.tsx
│   │       ├── components/ButtonEditor/ButtonEditorModal.tsx
│   │       ├── components/ButtonEditor/ActionTab.tsx
│   │       ├── components/ButtonEditor/AppearanceTab.tsx
│   │       ├── components/ButtonEditor/ShortcutTab.tsx
│   │       ├── components/StatusBar.tsx
│   │       └── lib/storage.ts
│   └── bridge/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           └── hidBridge.ts
└── README.md
```

---

## Frontend UI Specification

### Color Palette
- Background: #0a0d14 (near black)
- Card/surface: #1a1b26 (dark navy)  
- Button default bg: #1a1b26
- Button border: 1px dashed rgba(255,255,255,0.15)
- Text primary: #e2e8f0
- Text muted: #64748b
- Accent blue: #4f8ef7
- Status green: #22c55e
- Status red: #ef4444

### Layout
- Full-screen dark app
- Top bar: fixed 52px height, full width, blurred dark bg
- Main: centered 3x6 button grid
- Status bar: fixed bottom 44px

### TopBar.tsx
Left: "D" logo + "DeckForge" text + Profile dropdown ("Default" with chevron)
Center: Page tabs ("Page 1" active pill) + "+" add page button
Right: Bridge status pill (red "NO BRIDGE" / green "CONNECTED") + "EDIT" toggle + "Install App" button

### ButtonGrid.tsx + MacroButton.tsx
- 3 rows x 6 columns = 18 buttons, numbered 1-18
- Default: dark bg #1a1b26, dashed border, centered "+" icon (muted)
- Configured: label top, sub-label bottom small, bg color, icon if set
- Edit mode click → open ButtonEditorModal
- Run mode click → trigger action

### ButtonEditorModal.tsx
Modal with three tabs:

**Action tab** - Action type grid (selectable cards with icons):
Website | Hotkey | Hotkey Switch
Super Hotkeys | Mouse Event | Open App
Close App | Text/Snippet | Password
Multimedia | Audio Player | Action Flow
Window Changer | Display Settings | Spotify
Screenshot | CAD/SolidWorks | SwitchBot

Dynamic config fields below:
- Website → URL input
- Hotkey → key combo input
- Text/Snippet → textarea
- Open App → app path input
- Multimedia → media action select
- Others → "Coming soon"

**Appearance tab:**
- Label input
- Sub-label input
- Background Color (swatch + hex input, default #1a1b26)
- Icon URL input

**Shortcut tab:**
- "VSD M18 Shortcut" label
- Read-only shortcut display:
  Buttons 1-9 → Ctrl+Alt+Shift+1..9
  Button 10 → Ctrl+Alt+Shift+0
  Buttons 11-18 → Ctrl+Alt+Shift+A..H
- Helper: "Default: Ctrl+Alt+Shift+N. Listens in Run Mode."

### StatusBar.tsx
Left: "⚡ N/18 buttons configured" | "N action types"
Center: "Install App" blue button
Right: "Edit mode — click buttons to configure" OR "Run mode — click to trigger"

---

## State (Zustand — useDeckStore.ts)

```typescript
type ActionType = 'none' | 'website' | 'hotkey' | 'hotkey_switch' | 'super_hotkeys'
  | 'mouse_event' | 'open_app' | 'close_app' | 'text_snippet' | 'password'
  | 'multimedia' | 'audio_player' | 'action_flow' | 'window_changer'
  | 'display_settings' | 'spotify' | 'screenshot' | 'cad_solidworks' | 'switchbot';

interface ActionConfig {
  url?: string;
  keys?: string;
  text?: string;
  appPath?: string;
  mediaAction?: 'play_pause' | 'next' | 'prev' | 'vol_up' | 'vol_down' | 'mute';
}

interface ButtonConfig {
  id: number;           // 1-18
  label: string;
  subLabel: string;
  bgColor: string;      // hex default #1a1b26
  iconUrl: string;
  actionType: ActionType;
  actionConfig: ActionConfig;
  shortcut: string;     // e.g. "Ctrl+Alt+Shift+1"
}

interface Page {
  id: string;
  name: string;
  buttons: ButtonConfig[];
}

interface Profile {
  id: string;
  name: string;
  pages: Page[];
}

interface DeckStore {
  profiles: Profile[];
  activeProfileId: string;
  activePageId: string;
  isEditMode: boolean;
  bridgeStatus: 'connected' | 'disconnected' | 'connecting';
  bridgeUrl: string;
  editingButtonId: number | null;
  // Actions
  toggleEditMode: () => void;
  updateButton: (buttonId: number, config: Partial<ButtonConfig>) => void;
  addPage: () => void;
  addProfile: (name: string) => void;
  setBridgeStatus: (s: 'connected'|'disconnected'|'connecting') => void;
  setEditingButton: (id: number | null) => void;
  triggerButton: (buttonId: number) => void;
}
```

Persist to localStorage with `zustand/middleware/persist`.

---

## Bridge Hook (useBridge.ts)

Connect to ws://localhost:8765 (configurable via store.bridgeUrl).

Messages:
- Frontend → Bridge: `{ type: 'trigger', buttonId, actionType, actionConfig }`
- Bridge → Frontend: `{ type: 'button_press', buttonId }` | `{ type: 'status', connected, deviceName }`

On button_press received: trigger the button action.

---

## Shortcut Listener (useShortcuts.ts)

In Run Mode, listen for Ctrl+Alt+Shift+key combos:
1..9 → buttons 1-9, 0 → button 10, A-H → buttons 11-18

---

## Bridge Server (packages/bridge/src/index.ts)

```typescript
import { WebSocketServer } from 'ws';
// Port 8765
// Accept connections from frontend
// On trigger message: execute action (open URL via shell, simulate keys via robotjs/nut-js)
// Optional: read M18 HID events via node-hid and broadcast button_press to clients
```

Use `node-hid` for M18 USB HID. M18 HID vendor/product IDs:
- Try VID 0x0c45 (common for Mirabox/VSD devices)
- Fallback: scan all HID devices and find one with 18+ buttons

---

## PWA (public/manifest.json)

```json
{
  "name": "DeckForge",
  "short_name": "DeckForge",
  "theme_color": "#0a0d14",
  "background_color": "#0a0d14",
  "display": "standalone",
  "start_url": "/",
  "icons": [{ "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" }]
}
```

---

## Key Implementation Notes

1. The "Install App" button uses `beforeinstallprompt` event — capture and trigger on click
2. BridgeStatus shows in TopBar — auto-reconnect every 5s when disconnected
3. Button actions in browser (without bridge): 
   - website: `window.open(url)`
   - hotkey: show toast "Would send: {keys} (bridge required)"
   - text_snippet: copy to clipboard
4. All state persisted to localStorage via Zustand persist middleware
5. Default profile created on first load with 18 unconfigured buttons
6. The shortcut for button N:
   ```
   const getShortcut = (n: number) => {
     const key = n <= 9 ? String(n) : n === 10 ? '0' : String.fromCharCode(54 + n); // 11→A...18→H
     return `Ctrl+Alt+Shift+${key}`;
   };
   ```

---

## Development Commands

```bash
pnpm install
pnpm dev:frontend   # http://localhost:5173
pnpm dev:bridge     # ws://localhost:8765
pnpm dev            # both in parallel
```

---

## Priority Build Order

1. packages/frontend scaffolding (Vite + React + TS + Tailwind)
2. types/index.ts — all shared types
3. store/useDeckStore.ts — Zustand store with localStorage persist
4. components/TopBar.tsx
5. components/MacroButton.tsx + ButtonGrid.tsx
6. components/ButtonEditor/* (modal with 3 tabs)
7. components/StatusBar.tsx
8. hooks/useBridge.ts + hooks/useShortcuts.ts
9. App.tsx wiring everything together
10. packages/bridge — Node.js WS server
11. PWA manifest + service worker
