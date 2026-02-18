import { ButtonConfig } from '../../types';
import { useDeckStore } from '../../store/useDeckStore';

interface Props { button: ButtonConfig; }

export function ShortcutTab({ button }: Props) {
  const updateButton = useDeckStore((s) => s.updateButton);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          VSD M18 Shortcut
        </label>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500/50"
          value={button.shortcut}
          onChange={(e) => updateButton(button.id, { shortcut: e.target.value })}
          placeholder="Ctrl+Alt+Shift+1"
        />
        <p className="text-xs text-gray-600 leading-relaxed">
          Default: <span className="text-gray-500 font-mono">{button.shortcut}</span>.
          The web app listens for this shortcut in Run Mode to trigger the action.
        </p>
      </div>

      <div className="bg-white/4 rounded-xl p-3 space-y-2">
        <div className="text-xs text-gray-500 font-medium">Default M18 Shortcut Map</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Array.from({ length: 18 }, (_, i) => {
            const n = i + 1;
            let key: string;
            if (n <= 9) key = String(n);
            else if (n === 10) key = '0';
            else key = String.fromCharCode(54 + n);
            return (
              <div key={n} className={[
                'flex items-center justify-between text-xs py-0.5',
                button.id === n ? 'text-blue-400' : 'text-gray-600',
              ].join(' ')}>
                <span>Button {n}</span>
                <span className="font-mono text-[10px]">⌃⌥⇧{key}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
