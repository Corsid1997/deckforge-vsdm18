import { Download, Zap } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';

export function StatusBar() {
  const isEditMode = useDeckStore((s) => s.isEditMode);
  const activeButtons = useDeckStore((s) => s.activeButtons());
  const toggleEditMode = useDeckStore((s) => s.toggleEditMode);

  const configuredCount = activeButtons.filter((b) => b.actionType !== 'none').length;
  const actionTypes = new Set(
    activeButtons.filter((b) => b.actionType !== 'none').map((b) => b.actionType),
  ).size;

  return (
    <footer className="flex items-center gap-4 px-4 h-[44px] bg-[rgba(10,13,20,0.95)] backdrop-blur-sm border-t border-white/8 shrink-0 text-xs text-gray-500">
      {/* Left: configured count */}
      <div className="flex items-center gap-1.5">
        <Zap className="w-3 h-3 text-yellow-500" />
        <span>{configuredCount}/18 buttons configured</span>
      </div>

      <div className="w-px h-4 bg-white/10" />

      <span>{actionTypes} action types</span>

      {/* Center: Install App */}
      <div className="flex-1 flex justify-center">
        <button
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs font-medium hover:bg-blue-600/25 transition-colors"
          onClick={() => {
            const prompt = (window as any)._pwaPrompt;
            if (prompt) { prompt.prompt(); }
          }}
        >
          <Download className="w-3 h-3" />
          Install App
        </button>
      </div>

      {/* Right: mode indicator */}
      <div className="ml-auto text-gray-500">
        {isEditMode
          ? 'Edit mode — click buttons to configure'
          : 'Run mode — click to trigger actions'}
      </div>
    </footer>
  );
}
