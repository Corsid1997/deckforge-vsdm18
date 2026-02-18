import { useDeckStore } from '../../store/useDeckStore';
import { ButtonConfig, ActionType, ACTION_TYPE_LABELS } from '../../types';
import clsx from 'clsx';

interface Props { button: ButtonConfig; }

// Action type icons (emoji for simplicity, replace with real icons later)
const ACTION_ICONS: Partial<Record<ActionType, string>> = {
  website: '🌐',
  hotkey: '⌨️',
  hotkey_switch: '🔀',
  super_hotkeys: '⚡',
  mouse_event: '🖱️',
  open_app: '📂',
  close_app: '✕',
  text_snippet: '📝',
  password: '🔑',
  multimedia: '🎵',
  audio_player: '🔊',
  action_flow: '⚙️',
  window_changer: '🪟',
  display_settings: '🖥️',
  spotify: '🎧',
  screenshot: '📷',
  cad_solidworks: '📐',
  switchbot: '🤖',
};

const ACTION_TYPES: ActionType[] = [
  'website', 'hotkey', 'hotkey_switch',
  'super_hotkeys', 'mouse_event', 'open_app',
  'close_app', 'text_snippet', 'password',
  'multimedia', 'audio_player', 'action_flow',
  'window_changer', 'display_settings', 'spotify',
  'screenshot', 'cad_solidworks', 'switchbot',
];

export function ActionTab({ button }: Props) {
  const updateButton = useDeckStore((s) => s.updateButton);

  const setActionType = (type: ActionType) => {
    updateButton(button.id, { actionType: type, actionConfig: {} });
  };

  const setConfig = (patch: Partial<typeof button.actionConfig>) => {
    updateButton(button.id, { actionConfig: { ...button.actionConfig, ...patch } });
  };

  return (
    <div className="space-y-4">
      {/* Action type label */}
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
        Action Type
      </div>

      {/* Action type grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {ACTION_TYPES.map((type) => (
          <button
            key={type}
            className={clsx(
              'flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-xs transition-all border',
              button.actionType === type
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                : 'bg-white/4 border-white/8 text-gray-400 hover:bg-white/8 hover:text-gray-300',
            )}
            onClick={() => setActionType(type)}
          >
            <span className="text-base">{ACTION_ICONS[type] ?? '◻'}</span>
            <span className="text-center leading-tight">{ACTION_TYPE_LABELS[type]}</span>
          </button>
        ))}
      </div>

      {/* Config fields */}
      {button.actionType !== 'none' && (
        <div className="space-y-3 pt-1">
          <div className="h-px bg-white/8" />

          {button.actionType === 'website' && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">URL</label>
              <input
                type="url"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                placeholder="https://example.com"
                value={button.actionConfig.url ?? ''}
                onChange={(e) => setConfig({ url: e.target.value })}
              />
            </div>
          )}

          {(button.actionType === 'hotkey' || button.actionType === 'hotkey_switch') && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">Key combo</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 font-mono"
                placeholder="e.g. Ctrl+Shift+S"
                value={button.actionConfig.keys ?? ''}
                onChange={(e) => setConfig({ keys: e.target.value })}
              />
            </div>
          )}

          {button.actionType === 'text_snippet' && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">Text to type</label>
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 resize-none"
                placeholder="Type or paste text here..."
                rows={3}
                value={button.actionConfig.text ?? ''}
                onChange={(e) => setConfig({ text: e.target.value })}
              />
            </div>
          )}

          {button.actionType === 'open_app' && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">App path or name</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
                placeholder="C:\Path\To\App.exe"
                value={button.actionConfig.appPath ?? ''}
                onChange={(e) => setConfig({ appPath: e.target.value })}
              />
            </div>
          )}

          {button.actionType === 'multimedia' && (
            <div className="space-y-1.5">
              <label className="text-xs text-gray-500">Media action</label>
              <select
                className="w-full bg-[#1a1b26] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50"
                value={button.actionConfig.mediaAction ?? 'play_pause'}
                onChange={(e) => setConfig({ mediaAction: e.target.value as any })}
              >
                <option value="play_pause">Play / Pause</option>
                <option value="next">Next Track</option>
                <option value="prev">Previous Track</option>
                <option value="vol_up">Volume Up</option>
                <option value="vol_down">Volume Down</option>
                <option value="mute">Mute / Unmute</option>
              </select>
            </div>
          )}

          {/* Coming soon for other types */}
          {!['website','hotkey','hotkey_switch','text_snippet','open_app','multimedia','none'].includes(button.actionType) && (
            <div className="text-xs text-gray-600 italic">
              Configuration for {ACTION_TYPE_LABELS[button.actionType]} — coming soon.
              Bridge required for execution.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
