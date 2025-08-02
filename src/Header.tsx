import type { Scene } from './game-engine';
import { useState } from 'react';
type Props = { 
  inventory: Record<string, number>;
  isDev: boolean; 
  scene: Scene;
  traits: Record<string, number>;
};
export function Header({ inventory, isDev, scene, traits }: Props) {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [traitsOpen, setTraitsOpen] = useState(false);
  const inventoryItems = Object.entries(inventory);
  const traitItems = Object.entries(traits);
  return (
    <header className="game-header">
      {isDev && <div className="scene-id-debug">{scene.id}</div>}
      <span className="header-title">Exodus Adventure</span>
      <div className="header-dropdowns">
        <div className="header-inventory-dropdown">
          <button
            className="inventory-dropdown-toggle"
            aria-haspopup="listbox"
            aria-expanded={inventoryOpen}
            onClick={e => { e.stopPropagation(); setInventoryOpen(o => !o); }}
          >
            Inventory ({inventoryItems.length}) ▼
          </button>
          {inventoryOpen && (
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
            aria-expanded={traitsOpen}
            onClick={e => { e.stopPropagation(); setTraitsOpen(o => !o); }}
          >
            Traits ({traitItems.length}) ▼
          </button>
          {traitsOpen && (
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
      </div>
    </header>
  );
}
