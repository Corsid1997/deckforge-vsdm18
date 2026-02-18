import { useState } from 'react';
import { Pencil, Download, Plus, Wifi, WifiOff } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';
import clsx from 'clsx';

export function TopBar() {
  const {
    profiles,
    activeProfileId,
    activePageId,
    isEditMode,
    bridgeStatus,
    toggleEditMode,
    setActivePage,
    addPage,
    activeProfile,
  } = useDeckStore();

  const profile = activeProfile();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);

  // Capture PWA install prompt
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      setPwaPrompt(e);
    }, { once: true });
  }

  const handleInstall = () => {
    if (pwaPrompt) {
      pwaPrompt.prompt();
    } else {
      alert('To install: use your browser menu > "Add to Home Screen" or "Install App"');
    }
  };

  const BridgeIcon = bridgeStatus === 'connected' ? Wifi : WifiOff;
  const bridgeColor =
    bridgeStatus === 'connected' ? 'text-green-400' :
    bridgeStatus === 'connecting' ? 'text-yellow-400' : 'text-red-400';

  const bridgeLabel =
    bridgeStatus === 'connected' ? 'CONNECTED' :
    bridgeStatus === 'connecting' ? 'CONNECTING...' : 'NO BRIDGE';

  return (
    <header className="flex items-center gap-3 px-4 h-[52px] bg-[rgba(10,13,20,0.95)] backdrop-blur-sm border-b border-white/8 shrink-0 z-10">
      {/* Left: Logo + Profile */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-purple-700/80 flex items-center justify-center font-bold text-sm text-white">
            D
          </div>
          <span className="font-bold text-sm text-white">DeckForge</span>
        </div>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <span>{profile?.name ?? 'Default'}</span>
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showProfileMenu && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-[#1a1b26] border border-white/10 rounded-lg shadow-xl z-20 overflow-hidden">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  className={clsx(
                    'w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors',
                    p.id === activeProfileId ? 'text-blue-400' : 'text-gray-300',
                  )}
                  onClick={() => {
                    useDeckStore.getState().setActiveProfile(p.id);
                    setShowProfileMenu(false);
                  }}
                >
                  {p.name}
                </button>
              ))}
              <div className="border-t border-white/10">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:bg-white/10 flex items-center gap-2"
                  onClick={() => {
                    const name = prompt('Profile name:');
                    if (name?.trim()) useDeckStore.getState().addProfile(name.trim());
                    setShowProfileMenu(false);
                  }}
                >
                  <Plus className="w-3 h-3" /> New Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Page tabs */}
      <div className="flex-1 flex items-center gap-1.5 overflow-x-auto">
        {profile?.pages.map((page) => (
          <button
            key={page.id}
            className={clsx(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0',
              page.id === activePageId
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white',
            )}
            onClick={() => setActivePage(page.id)}
          >
            {page.name}
          </button>
        ))}
        <button
          className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors shrink-0"
          onClick={addPage}
          title="Add page"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Right: Bridge status + EDIT + Install */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Bridge status */}
        <button
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-xs font-medium transition-colors hover:bg-white/10',
            bridgeColor,
          )}
          title="Bridge connection"
        >
          <span className={clsx('w-1.5 h-1.5 rounded-full', {
            'bg-green-400': bridgeStatus === 'connected',
            'bg-yellow-400': bridgeStatus === 'connecting',
            'bg-red-400': bridgeStatus === 'disconnected',
          })} />
          {bridgeLabel}
        </button>

        {/* EDIT toggle */}
        <button
          className={clsx(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            isEditMode
              ? 'bg-blue-600/20 border border-blue-500/40 text-blue-400'
              : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10',
          )}
          onClick={toggleEditMode}
        >
          <Pencil className="w-3 h-3" />
          EDIT
        </button>

        {/* Install App */}
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 text-xs font-medium transition-colors"
          onClick={handleInstall}
        >
          <Download className="w-3 h-3" />
          Install App
        </button>
      </div>
    </header>
  );
}
