import './style.css';
import { ExodusGame, type Scene } from './game-engine';

// Utility to add inventory item
function addInventory(state: any, item: string, amount = 1) {
  if (!state.inventory[item]) state.inventory[item] = 0;
  state.inventory[item] += amount;
}

// Define initial scenes for the Exodus story
const scenes = [
  {
    id: 'burning-bush',
    description: 'You see a bush that burns but is not consumed. A voice calls your name: "Moses, Moses!"',
    backgroundImage: 'burning-bush.png', // Example image filename (should be in public/)
    bibleVerse: { book: 'Exodus', chapter: 3, verses: [2] },
    options: [
      { text: 'Approach the bush', nextScene: 'god-speaks', effect: (state: any) => { addInventory(state, 'faith'); } },
      { text: 'Run away', nextScene: 'run-away' },
      { text: 'Look for a staff nearby', nextScene: 'find-staff', effect: (state: any) => { addInventory(state, 'staff'); } }
    ]
  },
  {
    id: 'find-staff',
    description: 'You find a sturdy staff on the ground. It may be useful later.',
    options: [
      { text: 'Return to the bush', nextScene: 'god-speaks' }
    ]
  },
  {
    id: 'god-speaks',
    description: 'God speaks to you from the bush: "Take off your sandals, for the place where you are standing is holy ground."',
    options: [
      { text: 'Remove sandals and listen', nextScene: 'mission', effect: (state: any) => { addInventory(state, 'obedience'); } }
    ]
  },
  {
    id: 'run-away',
    description: 'You run away, but the memory of the burning bush stays with you.',
    options: [
      { text: 'Return to the bush', nextScene: 'burning-bush' }
    ]
  },
  {
    id: 'mission',
    description: 'God gives you a mission: "Go to Pharaoh and bring my people out of Egypt."',
    options: [
      { text: 'Accept the mission', nextScene: 'accepted', effect: (state: any) => { addInventory(state, 'trust'); } },
      { text: 'Refuse', nextScene: 'refused' }
    ]
  },
  {
    id: 'accepted',
    description: 'You accept God’s mission. Your journey begins! You travel to Egypt to confront Pharaoh.',
    options: [
      { text: 'Go to Pharaoh’s palace', nextScene: 'pharaoh-palace' }
    ]
  },
  {
    id: 'refused',
    description: 'You refuse, but God encourages you to trust Him.',
    options: [
      { text: 'Accept the mission', nextScene: 'accepted' }
    ]
  },
  {
    id: 'pharaoh-palace',
    description: 'You stand before Pharaoh. He looks at you with suspicion. "Let my people go," you declare.',
    options: [
      { text: 'Demand release', nextScene: 'pharaoh-refuses' },
      { text: 'Show a sign', nextScene: 'staff-to-snake', effect: (state: any) => { addInventory(state, 'borrowed staff'); } },
      { text: 'Offer a gift', nextScene: 'pharaoh-softens' } // No reward for this path
    ]
  },
  {
    id: 'pharaoh-softens',
    description: 'Pharaoh is surprised by your gift. He seems less hostile, but still refuses to let the people go.',
    options: [
      { text: 'Warn of plagues', nextScene: 'plagues-begin' },
      { text: 'Try to negotiate', nextScene: 'negotiation' }
    ]
  },
  {
    id: 'negotiation',
    description: 'You attempt to negotiate with Pharaoh. He offers to let only some people go.',
    options: [
      { text: 'Accept partial freedom', nextScene: 'partial-freedom' },
      { text: 'Insist on full freedom', nextScene: 'pharaoh-refuses' }
    ]
  },
  {
    id: 'partial-freedom',
    description: 'Some Israelites are freed, but many remain. The story ends with hope for the rest.',
    options: []
  },
  {
    id: 'pharaoh-refuses',
    description: 'Pharaoh refuses to let the Israelites go. God tells you to warn him of plagues.',
    options: [
      { text: 'Warn of plagues', nextScene: 'plagues-begin' }
    ]
  },
  {
    id: 'staff-to-snake',
    description: 'You throw your staff down and it becomes a snake! Pharaoh’s magicians do the same. Pharaoh is unimpressed.',
    options: [
      { text: 'Warn of plagues', nextScene: 'plagues-begin', effect: (state: any) => { addInventory(state, 'perseverance'); } }
    ]
  },
  {
    id: 'plagues-begin',
    description: 'The plagues begin: water turns to blood, frogs, gnats, and more. Pharaoh’s heart remains hard.',
    options: [
      { text: 'Continue with more plagues', nextScene: 'final-plague' }]
  },
  {
    id: 'final-plague',
    description: 'The final plague strikes: the death of the firstborn. Pharaoh finally lets the Israelites go.',
    options: [
      { text: 'Lead the people out', nextScene: 'red-sea' }]
  },
  {
    id: 'red-sea',
    description: 'You reach the Red Sea. Pharaoh’s army is pursuing you! The people panic.',
    options: [
      { text: 'Raise your staff', nextScene: 'sea-parts', effect: (state: any) => { addInventory(state, 'miraculous staff'); addInventory(state, 'deliverance'); } },
      { text: 'Pray for help', nextScene: 'sea-parts', effect: (state: any) => { addInventory(state, 'deliverance'); } },
      { text: 'Look for another way around', nextScene: 'lost-in-desert' }
    ]
  },
  {
    id: 'lost-in-desert',
    description: 'You try to find another way, but get lost in the desert. The journey is much harder.',
    options: [
      { text: 'Return to the sea', nextScene: 'red-sea' }]
  },
  {
    id: 'sea-parts',
    description: 'The sea miraculously parts! Do you lead the people through?',
    options: [
      { text: 'Go back to the safety of Egypt and rule under Pharaoh.', nextScene: 'partial-freedom' },
      { text: 'Lead the people through the sea', nextScene: 'crossing-red-sea' }
    ]
  },
  {
    id: 'crossing-red-sea',
    description: 'You lead the people through the dry seabed. The waters close behind you, drowning Pharaoh’s army.',
    options: [
      { text: 'Celebrate the deliverance', nextScene: 'mount-sinai', effect: (state: any) => { addInventory(state, 'deliverance'); } },
    ]
  },
  {
    id: 'mount-sinai',
    description: 'At Mount Sinai, God gives you the Ten Commandments. The people begin a new life as a free nation.',
    options: [
      { text: 'Reflect on the journey', nextScene: 'end', effect: (state: any) => { addInventory(state, 'wisdom'); } },
    ]
  },
  {
    id: 'end',
    description: 'You have led your people out of Egypt and received God’s law. The adventure continues in the wilderness...',
    options: []
  }
];

function filterOptions(scene: Scene, state: any) {
  // Hide options that require the staff if the player doesn't have it
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

async function render() {
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
  const filteredOptions = filterOptions(scene, state);

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
