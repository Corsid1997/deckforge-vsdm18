// ===== Action Types =====
export type ActionType =
  | 'none'
  | 'website'
  | 'hotkey'
  | 'hotkey_switch'
  | 'super_hotkeys'
  | 'mouse_event'
  | 'open_app'
  | 'close_app'
  | 'text_snippet'
  | 'password'
  | 'multimedia'
  | 'audio_player'
  | 'action_flow'
  | 'window_changer'
  | 'display_settings'
  | 'spotify'
  | 'screenshot'
  | 'cad_solidworks'
  | 'switchbot';

export type MediaAction = 'play_pause' | 'next' | 'prev' | 'vol_up' | 'vol_down' | 'mute';

export interface ActionConfig {
  url?: string;
  keys?: string;
  switchKeys?: string;   // for hotkey_switch (toggled state)
  text?: string;
  appPath?: string;
  mediaAction?: MediaAction;
  password?: string;
  windowName?: string;
  displayAction?: string;
}

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  none: 'None',
  website: 'Website',
  hotkey: 'Hotkey',
  hotkey_switch: 'Hotkey Switch',
  super_hotkeys: 'Super Hotkeys',
  mouse_event: 'Mouse Event',
  open_app: 'Open App',
  close_app: 'Close App',
  text_snippet: 'Text / Snippet',
  password: 'Password',
  multimedia: 'Multimedia',
  audio_player: 'Audio Player',
  action_flow: 'Action Flow',
  window_changer: 'Window Changer',
  display_settings: 'Display Settings',
  spotify: 'Spotify',
  screenshot: 'Screenshot',
  cad_solidworks: 'CAD / SolidWorks',
  switchbot: 'SwitchBot',
};

// ===== Button Config =====
export interface ButtonConfig {
  id: number;           // 1–18
  label: string;
  subLabel: string;
  bgColor: string;      // hex default '#1a1b26'
  iconUrl: string;
  actionType: ActionType;
  actionConfig: ActionConfig;
  shortcut: string;
}

// ===== Page / Profile =====
export interface Page {
  id: string;
  name: string;
  buttons: ButtonConfig[];
}

export interface Profile {
  id: string;
  name: string;
  pages: Page[];
}

// ===== Bridge =====
export type BridgeConnectionStatus = 'connected' | 'disconnected' | 'connecting';

export interface BridgeTriggerMessage {
  type: 'trigger';
  buttonId: number;
  actionType: ActionType;
  actionConfig: ActionConfig;
}

export interface BridgeButtonPressMessage {
  type: 'button_press';
  buttonId: number;
}

export interface BridgeStatusMessage {
  type: 'status';
  connected: boolean;
  deviceName?: string;
}

export type BridgeMessage =
  | BridgeTriggerMessage
  | BridgeButtonPressMessage
  | BridgeStatusMessage;

// ===== Helpers =====
export function getDefaultShortcut(buttonId: number): string {
  let key: string;
  if (buttonId <= 9) key = String(buttonId);
  else if (buttonId === 10) key = '0';
  else key = String.fromCharCode(54 + buttonId); // 11->A, 12->B ... 18->H
  return `Ctrl+Alt+Shift+${key}`;
}

export function createDefaultButton(id: number): ButtonConfig {
  return {
    id,
    label: '',
    subLabel: '',
    bgColor: '#1a1b26',
    iconUrl: '',
    actionType: 'none',
    actionConfig: {},
    shortcut: getDefaultShortcut(id),
  };
}

export function createDefaultPage(name = 'Page 1'): Page {
  return {
    id: crypto.randomUUID(),
    name,
    buttons: Array.from({ length: 18 }, (_, i) => createDefaultButton(i + 1)),
  };
}

export function createDefaultProfile(name = 'Default'): Profile {
  return {
    id: crypto.randomUUID(),
    name,
    pages: [createDefaultPage()],
  };
}
