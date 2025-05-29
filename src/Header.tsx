import type { Scene } from './game-engine';
import { useState } from 'react';
type Props = { 
  inventory: Record<string, number>;
  isDev: boolean; 
  scene: Scene;
};
export function Header({ inventory, isDev, scene }: Props) {
  const [open, setOpen] = useState(false);
  const items = Object.entries(inventory);
  return (
    <header className="game-header">
      {isDev && <div className="scene-id-debug">{scene.id}</div>}
      <span className="header-title">Exodus Adventure</span>
      <div className="header-inventory-dropdown">
        <button
          className="inventory-dropdown-toggle"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        >
          Inventory ({items.length}) ▼
        </button>
        {open && (
          <div className="inventory-dropdown-list">
            {items.length === 0 ? (
              <div className="header-inventory-list">Nothing</div>
            ) : (
              items.map(([item, count]) => (
                <div className="inventory-box" key={item}>
                  <span className="inventory-item">{item}</span>
                  <span className="inventory-count">{count}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
