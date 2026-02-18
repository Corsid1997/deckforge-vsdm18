import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Profile,
  Page,
  ButtonConfig,
  ActionConfig,
  ActionType,
  BridgeConnectionStatus,
  createDefaultProfile,
  createDefaultPage,
} from '../types';

interface DeckStore {
  // State
  profiles: Profile[];
  activeProfileId: string;
  activePageId: string;
  isEditMode: boolean;
  bridgeStatus: BridgeConnectionStatus;
  bridgeUrl: string;
  editingButtonId: number | null;

  // Profile actions
  addProfile: (name: string) => void;
  removeProfile: (id: string) => void;
  renameProfile: (id: string, name: string) => void;
  setActiveProfile: (id: string) => void;

  // Page actions
  addPage: () => void;
  removePage: (id: string) => void;
  setActivePage: (id: string) => void;

  // Button actions
  updateButton: (buttonId: number, config: Partial<ButtonConfig>) => void;

  // UI actions
  toggleEditMode: () => void;
  setEditingButton: (id: number | null) => void;

  // Bridge actions
  setBridgeStatus: (status: BridgeConnectionStatus) => void;
  setBridgeUrl: (url: string) => void;

  // Trigger
  triggerButton: (buttonId: number) => void;

  // Selectors
  activeProfile: () => Profile | undefined;
  activePage: () => Page | undefined;
  activeButtons: () => ButtonConfig[];
}

export const useDeckStore = create<DeckStore>()(
  persist(
    (set, get) => {
      const defaultProfile = createDefaultProfile();
      return {
        profiles: [defaultProfile],
        activeProfileId: defaultProfile.id,
        activePageId: defaultProfile.pages[0].id,
        isEditMode: true,
        bridgeStatus: 'disconnected',
        bridgeUrl: 'ws://localhost:8765',
        editingButtonId: null,

        // Profile actions
        addProfile: (name) => {
          const p = createDefaultProfile(name);
          set((s) => ({ profiles: [...s.profiles, p], activeProfileId: p.id, activePageId: p.pages[0].id }));
        },
        removeProfile: (id) =>
          set((s) => {
            const profiles = s.profiles.filter((p) => p.id !== id);
            if (!profiles.length) return s;
            return {
              profiles,
              activeProfileId: profiles[0].id,
              activePageId: profiles[0].pages[0].id,
            };
          }),
        renameProfile: (id, name) =>
          set((s) => ({
            profiles: s.profiles.map((p) => (p.id === id ? { ...p, name } : p)),
          })),
        setActiveProfile: (id) => {
          const p = get().profiles.find((pr) => pr.id === id);
          if (p) set({ activeProfileId: id, activePageId: p.pages[0].id });
        },

        // Page actions
        addPage: () => {
          const page = createDefaultPage('Page ' + (get().activePage()?.name ? '' : ''));
          set((s) => ({
            profiles: s.profiles.map((p) =>
              p.id === s.activeProfileId
                ? { ...p, pages: [...p.pages, { ...createDefaultPage(), name: 'Page ' + (p.pages.length + 1) }] }
                : p,
            ),
          }));
        },
        removePage: (id) =>
          set((s) => ({
            profiles: s.profiles.map((p) =>
              p.id === s.activeProfileId
                ? { ...p, pages: p.pages.filter((pg) => pg.id !== id) }
                : p,
            ),
          })),
        setActivePage: (id) => set({ activePageId: id }),

        // Button actions
        updateButton: (buttonId, config) =>
          set((s) => ({
            profiles: s.profiles.map((p) =>
              p.id !== s.activeProfileId
                ? p
                : {
                    ...p,
                    pages: p.pages.map((pg) =>
                      pg.id !== s.activePageId
                        ? pg
                        : {
                            ...pg,
                            buttons: pg.buttons.map((b) =>
                              b.id === buttonId ? { ...b, ...config } : b,
                            ),
                          },
                    ),
                  },
            ),
          })),

        // UI actions
        toggleEditMode: () => set((s) => ({ isEditMode: !s.isEditMode })),
        setEditingButton: (id) => set({ editingButtonId: id }),

        // Bridge actions
        setBridgeStatus: (bridgeStatus) => set({ bridgeStatus }),
        setBridgeUrl: (bridgeUrl) => set({ bridgeUrl }),

        // Trigger
        triggerButton: (buttonId) => {
          const buttons = get().activeButtons();
          const btn = buttons.find((b) => b.id === buttonId);
          if (!btn) return;
          if (btn.actionType === 'website' && btn.actionConfig.url) {
            window.open(btn.actionConfig.url, '_blank');
          } else if (btn.actionType === 'text_snippet' && btn.actionConfig.text) {
            navigator.clipboard.writeText(btn.actionConfig.text);
          }
        },

        // Selectors
        activeProfile: () => get().profiles.find((p) => p.id === get().activeProfileId),
        activePage: () => {
          const profile = get().activeProfile();
          return profile?.pages.find((pg) => pg.id === get().activePageId);
        },
        activeButtons: () => get().activePage()?.buttons ?? [],
      };
    },
    {
      name: 'deckforge-store',
      version: 1,
    },
  ),
);
