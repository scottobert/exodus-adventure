import './style.css';
import { ExodusGame } from './game-engine';

// Define initial scenes for the Exodus story
const scenes = [
  {
    id: 'burning-bush',
    description: 'You see a bush that burns but is not consumed. A voice calls your name: "Moses, Moses!"',
    options: [
      { text: 'Approach the bush', nextScene: 'god-speaks' },
      { text: 'Run away', nextScene: 'run-away' }
    ]
  },
  {
    id: 'god-speaks',
    description: 'God speaks to you from the bush: "Take off your sandals, for the place where you are standing is holy ground."',
    options: [
      { text: 'Remove sandals and listen', nextScene: 'mission' }
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
      { text: 'Accept the mission', nextScene: 'accepted' },
      { text: 'Refuse', nextScene: 'refused' }
    ]
  },
  {
    id: 'accepted',
    description: 'You accept God’s mission. Your journey begins!',
    options: []
  },
  {
    id: 'refused',
    description: 'You refuse, but God encourages you to trust Him.',
    options: [
      { text: 'Accept the mission', nextScene: 'accepted' }
    ]
  }
];

const game = new ExodusGame(scenes, 'burning-bush');

function render() {
  const scene = game.getCurrentScene();
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) return;
  app.innerHTML = `
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
