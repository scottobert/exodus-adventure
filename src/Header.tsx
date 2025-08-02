import type { Scene } from './game-engine';
import { useState } from 'react';
type Props = { 
  inventory: Record<string, number>;
  isDev: boolean; 
  scene: Scene;
  traits?: Record<string, number>;
};
export function Header({ inventory, isDev, scene, traits }: Props) {
  const [open, setOpen] = useState(false);
  const inventoryItems = Object.entries(inventory);
  const traitItems = traits ? Object.entries(traits) : [];
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
          Inventory ({inventoryItems.length}) ▼
        </button>
        {open && (
          <div className="inventory-dropdown-list">
            {inventoryItems.length === 0 ? (
              <div className="header-inventory-list">Nothing</div>
            ) : (
              inventoryItems.map(([item, count]) => (
                <div className="inventory-box" key={item}>
                  <span className="inventory-item">{item}</span>
                  <span className="inventory-count">{count}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>      
      <div className="header-traits-dropdown">
        <button
          className="traits-dropdown-toggle"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        >
          Traits ({traitItems.length}) ▼
        </button>
        {open && (
          <div className="traits-dropdown-list">
            {traitItems.length === 0 ? (
              <div className="header-traits-list">Nothing</div>
            ) : (
              traitItems.map(([item, count]) => (
                <div className="traits-box" key={item}>
                  <span className="traits-item">{item}</span>
                  <span className="traits-count">{count}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </header>
  );
}
