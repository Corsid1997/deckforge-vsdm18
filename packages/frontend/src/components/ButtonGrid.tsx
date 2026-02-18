import { useDeckStore } from '../store/useDeckStore';
import { MacroButton } from './MacroButton';

export function ButtonGrid() {
  const activeButtons = useDeckStore((s) => s.activeButtons());

  return (
    <div
      className="grid gap-2 w-full"
      style={{
        // 6 columns, 3 rows = 18 buttons
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        // Max size so it fits nicely on screen
        maxWidth: 'min(760px, calc(100vw - 2rem))',
        maxHeight: 'min(400px, calc(100vh - 120px))',
      }}
    >
      {activeButtons.map((btn) => (
        <MacroButton key={btn.id} button={btn} />
      ))}
    </div>
  );
}
