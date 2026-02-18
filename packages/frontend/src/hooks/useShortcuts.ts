import { useEffect } from 'react';
import { useDeckStore } from '../store/useDeckStore';

// Shortcut map: Ctrl+Alt+Shift+key -> buttonId (1-18)
// 1-9 -> buttons 1-9
// 0 -> button 10
// A-H -> buttons 11-18
function getButtonIdFromKey(key: string): number | null {
  const upper = key.toUpperCase();
  if (key >= '1' && key <= '9') return parseInt(key);
  if (key === '0') return 10;
  if (upper >= 'A' && upper <= 'H') return upper.charCodeAt(0) - 54; // A=11, B=12...H=18
  return null;
}

export function useShortcuts() {
  const isEditMode = useDeckStore((s) => s.isEditMode);
  const triggerButton = useDeckStore((s) => s.triggerButton);

  useEffect(() => {
    if (isEditMode) return; // only active in run mode

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Ctrl+Alt+Shift
      if (!e.ctrlKey || !e.altKey || !e.shiftKey) return;
      if (e.metaKey) return;

      const buttonId = getButtonIdFromKey(e.key);
      if (buttonId === null) return;

      e.preventDefault();
      e.stopPropagation();
      triggerButton(buttonId);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isEditMode, triggerButton]);
}
