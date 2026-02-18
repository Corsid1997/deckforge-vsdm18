import { useState } from 'react';
import { X } from 'lucide-react';
import { useDeckStore } from '../../store/useDeckStore';
import { ActionTab } from './ActionTab';
import { AppearanceTab } from './AppearanceTab';
import { ShortcutTab } from './ShortcutTab';
import clsx from 'clsx';

type Tab = 'action' | 'appearance' | 'shortcut';

interface Props {
  buttonId: number;
}

export function ButtonEditorModal({ buttonId }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('action');
  const setEditingButton = useDeckStore((s) => s.setEditingButton);
  const button = useDeckStore((s) =>
    s.activeButtons().find((b) => b.id === buttonId),
  );

  if (!button) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'action', label: 'Action' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'shortcut', label: 'Shortcut' },
  ];

  return (
    <div className="modal-backdrop" onClick={(e) => {
      if (e.target === e.currentTarget) setEditingButton(null);
    }}>
      <div
        className="bg-[#1a1b26] border border-white/10 rounded-2xl w-full max-w-sm mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          <h2 className="text-base font-semibold text-white">Button {buttonId}</h2>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setEditingButton(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 border-b border-white/8 pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={clsx(
                'px-4 py-2 text-sm font-medium rounded-t-lg -mb-px border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'text-white border-blue-500 bg-blue-500/10'
                  : 'text-gray-500 border-transparent hover:text-gray-300',
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {activeTab === 'action' && <ActionTab button={button} />}
          {activeTab === 'appearance' && <AppearanceTab button={button} />}
          {activeTab === 'shortcut' && <ShortcutTab button={button} />}
        </div>
      </div>
    </div>
  );
}
