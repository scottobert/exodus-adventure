import './style.css';
import { ExodusGame } from './game-engine';

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
      { text: 'Check your inventory', nextScene: 'show-inventory' }
    ]
  },
  {
    id: 'mount-sinai',
    description: 'At Mount Sinai, God gives you the Ten Commandments. The people begin a new life as a free nation.',
    options: [
      { text: 'Reflect on the journey', nextScene: 'end', effect: (state: any) => { addInventory(state, 'wisdom'); } },
      { text: 'Check your inventory', nextScene: 'show-inventory' }]
  },
  {
    id: 'show-inventory',
    description: 'You check your belongings: ',
    options: [
      { text: 'Continue', nextScene: 'end' }
    ]
  },
  {
    id: 'end',
    description: 'You have led your people out of Egypt and received God’s law. The adventure continues in the wilderness...',
    options: []
  }
];

const game = new ExodusGame(scenes, 'burning-bush');

function render() {
  const scene = game.getCurrentScene();
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;
  const state = game.getState();

  // Header bar with title and inventory
  let inventoryHtml = '';
  const items = Object.entries(state.inventory);
  if (items.length > 0) {
    inventoryHtml = `<div class="header-inventory-list">${items.map(([item, count]) => `
      <div class=\"inventory-box\"><span class=\"inventory-item\">${item}</span><span class=\"inventory-count\">${count}</span></div>
    `).join('')}</div>`;
  } else {
    inventoryHtml = `<div class="header-inventory-list">Nothing</div>`;
  }

  const headerHtml = `
    <header class="game-header">
      <span class="header-title">Exodus Adventure</span>
      ${inventoryHtml}
    </header>
  `;

  app.innerHTML = `
    ${headerHtml}
    <div class="game-container">
      <div class="scene-description">${scene.description}</div>
      <div class="options">
        ${(scene.options || []).map((opt: any, i: number) => `<button data-index="${i}">${opt.text}</button>`).join('')}
      </div>
    </div>
  `;
  const buttons = app.querySelectorAll<HTMLButtonElement>('.options button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      game.chooseOption(parseInt(btn.getAttribute('data-index') || '0', 10));
      render();
    });
  });
}

render();
