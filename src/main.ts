import './style.css';
import { ExodusGame } from './game-engine';

// Define initial scenes for the Exodus story
const scenes = [
  {
    id: 'burning-bush',
    description: 'You see a bush that burns but is not consumed. A voice calls your name: "Moses, Moses!"',
    options: [
      { text: 'Approach the bush', nextScene: 'god-speaks', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('faith')) state.inventory.push('faith'); } },
      { text: 'Run away', nextScene: 'run-away' },
      { text: 'Look for a staff nearby', nextScene: 'find-staff', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('staff')) state.inventory.push('staff'); } }
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
      { text: 'Remove sandals and listen', nextScene: 'mission', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('obedience')) state.inventory.push('obedience'); } }
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
      { text: 'Accept the mission', nextScene: 'accepted', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('trust')) state.inventory.push('trust'); } },
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
      { text: 'Show a sign', nextScene: 'staff-to-snake', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('staff')) state.inventory.push('borrowed staff'); } },
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
      { text: 'Warn of plagues', nextScene: 'plagues-begin', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('perseverance')) state.inventory.push('perseverance'); } }
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
      { text: 'Raise your staff', nextScene: 'sea-parts', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('staff')) state.inventory.push('miraculous staff'); if (!state.inventory.includes('deliverance')) state.inventory.push('deliverance'); } },
      { text: 'Pray for help', nextScene: 'sea-parts', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('deliverance')) state.inventory.push('deliverance'); } },
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
    id: 'mount-sinai',
    description: 'At Mount Sinai, God gives you the Ten Commandments. The people begin a new life as a free nation.',
    options: [
      { text: 'Reflect on the journey', nextScene: 'end', effect: (state: import('./game-engine').GameState) => { if (!state.inventory.includes('wisdom')) state.inventory.push('wisdom'); } },
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
  // Show inventory on all screens after first item is obtained
  let inventoryHtml = '';
  if (state.inventory.length > 0) {
    inventoryHtml = `<div style="margin-bottom:1em;"><strong>Inventory:</strong> ${state.inventory.join(', ')}</div>`;
  }
  // Special case for show-inventory scene (already handled)
  if (scene.id === 'show-inventory') {
    inventoryHtml = `<div style="margin-bottom:1em;"><strong>Inventory:</strong> ${state.inventory.length ? state.inventory.join(', ') : 'Nothing'}</div>`;
  }
  app.innerHTML = `
    <div class="game-container">
      <div class="scene-description">${scene.description}${inventoryHtml}</div>
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
