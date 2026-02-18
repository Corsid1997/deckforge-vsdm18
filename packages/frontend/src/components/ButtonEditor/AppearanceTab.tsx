import { useDeckStore } from '../../store/useDeckStore';
import { ButtonConfig } from '../../types';

interface Props { button: ButtonConfig; }

export function AppearanceTab({ button }: Props) {
  const updateButton = useDeckStore((s) => s.updateButton);

  const update = (patch: Partial<ButtonConfig>) => updateButton(button.id, patch);

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500">Label</label>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
          placeholder="Button label"
          value={button.label}
          onChange={(e) => update({ label: e.target.value })}
        />
      </div>

      {/* Sub-label */}
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500">Sub-label</label>
        <input
          type="text"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
          placeholder="Optional sub-label"
          value={button.subLabel}
          onChange={(e) => update({ subLabel: e.target.value })}
        />
      </div>

      {/* Background color */}
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500">Background Color</label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="color"
              className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
              value={button.bgColor || '#1a1b26'}
              onChange={(e) => update({ bgColor: e.target.value })}
            />
          </div>
          <input
            type="text"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500/50"
            placeholder="#1a1b26"
            value={button.bgColor}
            onChange={(e) => update({ bgColor: e.target.value })}
          />
        </div>
      </div>

      {/* Icon URL */}
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500">Icon URL</label>
        <input
          type="url"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50"
          placeholder="https://... or upload"
          value={button.iconUrl}
          onChange={(e) => update({ iconUrl: e.target.value })}
        />
        {button.iconUrl && (
          <img
            src={button.iconUrl}
            alt="icon preview"
            className="w-8 h-8 rounded object-contain mt-1"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
      </div>

      {/* Preview */}
      <div className="space-y-1.5">
        <label className="text-xs text-gray-500">Preview</label>
        <div
          className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/10 mx-auto"
          style={{ backgroundColor: button.bgColor || '#1a1b26' }}
        >
          {button.iconUrl && (
            <img src={button.iconUrl} alt="" className="w-6 h-6 object-contain" />
          )}
          {button.label && (
            <span className="text-xs font-medium text-white/90 text-center px-1 leading-tight">
              {button.label}
            </span>
          )}
          {button.subLabel && (
            <span className="text-[9px] text-white/50 text-center">{button.subLabel}</span>
          )}
        </div>
      </div>
    </div>
  );
}
