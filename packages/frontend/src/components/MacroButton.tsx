import { Plus } from 'lucide-react';
import { useDeckStore } from '../store/useDeckStore';
import { ButtonConfig } from '../types';
import clsx from 'clsx';

interface Props {
  button: ButtonConfig;
}

export function MacroButton({ button }: Props) {
  const isEditMode = useDeckStore((s) => s.isEditMode);
  const editingButtonId = useDeckStore((s) => s.editingButtonId);
  const setEditingButton = useDeckStore((s) => s.setEditingButton);
  const triggerButton = useDeckStore((s) => s.triggerButton);

  const isEmpty = button.actionType === 'none' && !button.label;
  const isEditing = editingButtonId === button.id;

  const handleClick = () => {
    if (isEditMode) {
      setEditingButton(isEditing ? null : button.id);
    } else {
      triggerButton(button.id);
    }
  };

  return (
    <button
      className={clsx(
        'relative aspect-square rounded-xl transition-all duration-150 flex flex-col items-center justify-center gap-1 p-2 overflow-hidden group',
        isEmpty
          ? 'btn-empty'
          : 'border border-white/10',
        isEditing && 'ring-2 ring-blue-500 ring-offset-1 ring-offset-[#0a0d14]',
        !isEditing && 'hover:border-white/25 hover:brightness-125',
      )}
      style={!isEmpty ? { backgroundColor: button.bgColor || '#1a1b26' } : undefined}
      onClick={handleClick}
      title={isEditMode ? 'Click to edit' : button.label || 'Button ' + button.id}
    >
      {isEmpty ? (
        /* Empty state: show + icon */
        <Plus
          className={clsx(
            'w-5 h-5 transition-colors',
            isEditMode ? 'text-white/20 group-hover:text-white/40' : 'text-white/15',
          )}
        />
      ) : (
        /* Configured state */
        <>
          {button.iconUrl && (
            <img
              src={button.iconUrl}
              alt=""
              className="w-6 h-6 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          {button.label && (
            <span className="text-xs font-medium text-center leading-tight line-clamp-2 text-white/90">
              {button.label}
            </span>
          )}
          {button.subLabel && (
            <span className="text-[10px] text-white/50 text-center leading-tight">
              {button.subLabel}
            </span>
          )}
        </>
      )}

      {/* Button number overlay (always visible, top-left) */}
      <span className="absolute top-1 left-1.5 text-[9px] text-white/25 font-mono">
        {button.id}
      </span>
    </button>
  );
}
