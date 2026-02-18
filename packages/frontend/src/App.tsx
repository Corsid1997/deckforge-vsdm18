import { useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { ButtonGrid } from './components/ButtonGrid';
import { StatusBar } from './components/StatusBar';
import { ButtonEditorModal } from './components/ButtonEditor/ButtonEditorModal';
import { useDeckStore } from './store/useDeckStore';
import { useBridge } from './hooks/useBridge';
import { useShortcuts } from './hooks/useShortcuts';

export default function App() {
  const editingButtonId = useDeckStore((s) => s.editingButtonId);
  const isEditMode = useDeckStore((s) => s.isEditMode);

  useBridge();
  useShortcuts();

  return (
    <div className="flex flex-col h-screen bg-[#0a0d14] text-gray-100 overflow-hidden select-none">
      {/* Top navigation bar */}
      <TopBar />

      {/* Main content - centered button grid */}
      <main className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <ButtonGrid />
      </main>

      {/* Status bar */}
      <StatusBar />

      {/* Button editor modal */}
      {editingButtonId !== null && isEditMode && (
        <ButtonEditorModal buttonId={editingButtonId} />
      )}
    </div>
  );
}
