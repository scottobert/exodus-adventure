import './style.css';
import { ExodusGame, type Scene } from './game-engine';

// Utility to add inventory item
function addInventory(state: any, item: string, amount = 1) {
  if (!state.inventory[item]) state.inventory[item] = 0;
  state.inventory[item] += amount;
}

let scenes: Scene[] = [];

async function loadScenes() {
  const res = await fetch('scenes.json');
  const data = await res.json();
  scenes = data.map((scene: any) => ({
    ...scene,
    options: scene.options.map((opt: any) => ({
      ...opt,
      effect: opt.effect
        ? function(state: any) { if (state) { return (new Function('state', 'addInventory', opt.effect))(state, addInventory); } } 
        : undefined
    }))
  }));
}

const game = new ExodusGame(scenes, 'burning-bush');

async function fetchBibleVerse(reference: Scene["bibleVerse"]): Promise<string> {
  if (!reference || !reference.book || !reference.chapter || !reference.verses) {
    console.warn('Invalid Bible verse reference:', reference);
    return '';
  }
  console.log('Fetching Bible verse:', reference);
  try {
    const res = await fetch(`https://bible.helloao.org/api/ENGWEBP/${reference.book}/${reference.chapter}.json`);
    const data = await res.json();
    const versesArr = data?.chapter?.content?.filter((v: any) => reference.verses.includes(v.number));
    // build the full text of all the verses
    if (!versesArr) {
      console.warn('No verses found for reference:', reference);
      return '';
    }
    console.log('Fetched verses:', versesArr);
    const verseText = versesArr.map((v: any) => {
      console.log('Processing verse:', v);
      const text = v.content.map((t: any) => {
        console.log('Processing text part:', t);
        if (typeof t === 'string') {
          return t;
        }
      });
      return text.join(' ');
    });
    const chapter = reference.chapter.toString();
    const verse = reference.verses.join(', ');

    if (verseText) {
      return `<div class='bible-verse'><span class='bible-ref'>Exodus ${chapter}:${verse}</span> — <span class='bible-text'>${verseText}</span></div>`;
    }
    console.warn('No text found for verses:', reference.verses);
    return '';
  } catch (error) {
    console.error('Error fetching Bible verse:', reference);
    console.error(error);
    return '';
  }
}

// filterOptions function for staff logic
function filterOptions(scene: Scene, state: any) {
  if (scene.id === 'pharaoh-palace' || scene.id === 'red-sea') {
    return scene.options.filter(opt => {
      if (opt.text.toLowerCase().includes('staff')) {
        return state.inventory['staff'] > 0;
      }
      return true;
    });
  }
  return scene.options;
}

async function render() {
  if (scenes.length === 0) {
    await loadScenes();
    // Patch: update game.scenes via a method, not direct property
    (game as any).scenes = Object.fromEntries(scenes.map(s => [s.id, s]));
  }
  const scene = game.getCurrentScene();
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;
  const state = game.getState();

  // Header bar with title and inventory dropdown
  let inventoryHtml = '';
  const items = Object.entries(state.inventory);
  if (items.length > 0) {
    inventoryHtml = `
      <div class="header-inventory-dropdown">
        <button class="inventory-dropdown-toggle" aria-haspopup="listbox" aria-expanded="false">Inventory (${items.length}) ▼</button>
        <div class="inventory-dropdown-list" style="display:none;">
          ${items.map(([item, count]) => `
            <div class=\"inventory-box\"><span class=\"inventory-item\">${item}</span><span class=\"inventory-count\">${count}</span></div>
          `).join('')}
        </div>
      </div>
    `;
  } else {
    inventoryHtml = `<div class="header-inventory-list">Nothing</div>`;
  }

  const headerHtml = `
    <header class="game-header">
      <span class="header-title">Exodus Adventure</span>
      ${inventoryHtml}
    </header>
  `;

  // Background image logic
  let backgroundHtml = '';
  if (scene.backgroundImage) {
    backgroundHtml = `<div class="scene-background"><img src="${scene.backgroundImage}" alt="Scene background" /></div>`;
  }

  // Bible verse placeholder
  let bibleVerseHtml = '';
  if (scene.bibleVerse) {
    bibleVerseHtml = await fetchBibleVerse(scene.bibleVerse);
  }

  // Scene ID debug display (top left) if in debug environment
  let debugIdHtml = '';
  if (import.meta.env && import.meta.env.MODE === 'development') {
    debugIdHtml = `<div class="scene-id-debug">${scene.id}</div>`;
  }

  // Use filtered options for scenes that require staff
  const filteredOptions = typeof filterOptions === 'function' ? filterOptions(scene, state) : scene.options;

  app.innerHTML = `
    ${headerHtml}
    <div class="game-container">
      ${debugIdHtml}
      ${backgroundHtml}
      <div class="scene-description">${scene.description}</div>
      <div class="options">
        ${filteredOptions.map((opt: any, i: number) => `<button data-index="${i}">${opt.text}</button>`).join('')}
      </div>
      <div class="scene-bible-verse">${bibleVerseHtml}</div>
    </div>
  `;
  // Dropdown logic
  const dropdownToggle = app.querySelector<HTMLButtonElement>('.inventory-dropdown-toggle');
  const dropdownList = app.querySelector<HTMLDivElement>('.inventory-dropdown-list');
  if (dropdownToggle && dropdownList) {
    dropdownList.style.display = 'none'; // Always start hidden
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownToggle.addEventListener('click', (event) => {
      event.stopPropagation();
      if (dropdownList.style.display === 'none') {
        dropdownList.style.display = 'flex';
        dropdownToggle.setAttribute('aria-expanded', 'true');
      } else {
        dropdownList.style.display = 'none';
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('click', (e) => {
      if (!dropdownToggle.contains(e.target as Node) && !dropdownList.contains(e.target as Node)) {
        dropdownList.style.display = 'none';
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    }, true);
  }

  // Fix: Add event listeners for action buttons after dropdown logic
  const buttons = app.querySelectorAll<HTMLButtonElement>('.options button');
  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      // Use the filtered option's index in the original options array
      const optionIndex = scene.options.findIndex(opt => opt.text === filteredOptions[i].text);
      game.chooseOption(optionIndex);
      render();
    });
  });
}

render();
