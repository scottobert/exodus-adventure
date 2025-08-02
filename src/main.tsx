import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { ExodusGame, type Scene, type GameState } from './game-engine';
import { Header } from './Header';
import { GameContainer } from './GameContainer';

// Helper to add inventory
function addInventory(state: GameState, item: string, amount = 1) {
  if (!state.inventory[item]) {
    state.inventory[item] = 0;
  }
  state.inventory[item] += amount;
}

function resetInventory(state: GameState) {
  state.inventory = {
  };
}

function subtractInventory(state: GameState, item: string, amount = 1) {
  if (state.inventory[item] && state.inventory[item] >= amount) {
    state.inventory[item] -= amount;
  }
  if (state.inventory[item] <= 0) {
    delete state.inventory[item];
  }
}
// Helper to add traits
function addTrait(state: GameState, item: string, amount = 1) {
  if (!state.traits[item]) {
    state.traits[item] = 0;
  }
  state.traits[item] += amount;
}

function resetTraits(state: GameState) {
  state.traits = {
  };
}

function subtractTraits(state: GameState, item: string, amount = 1) {
  if (state.traits[item] && state.traits[item] >= amount) {
    state.traits[item] -= amount;
  }
  if (state.traits[item] <= 0) {
    delete state.traits[item];
  }
}

function addLeviticusKeyIfQualified(state: GameState) {
  const hasDeliverance = state.traits["deliverance"] && state.traits["deliverance"] >= 2;
  const hasFaith = state.traits["faith"] && state.traits["faith"] >= 2;
  if (hasDeliverance && hasFaith) {
    addInventory(state, "leviticus key", 1);
    return true;
  }
  return false;
}

// Parse effect string to function
// Parse effect object to function
type EffectObj = {
  type: string;
  [key: string]: any;
};

function parseEffect(effect: EffectObj | undefined) {
  if (!effect) return undefined;
  // Handle legacy string effects or invalid formats
  if (typeof effect === "string" || typeof effect !== "object" || !("type" in effect)) {
    // Use a logging framework if available, otherwise fallback to console.warn
    console.warn("Effect is not an object with a type property. Ignoring effect:", effect);
    return undefined;
  }
  return function (state: GameState) {
    switch (effect.type) {
      case "addInventory":
        // Use a logging framework if available, otherwise fallback to console.log
        console.log(`Adding ${effect.amount ?? 1} of ${effect.item} to inventory`);
        addInventory(state, effect.item, effect.amount ?? 1);
        break;
      case "resetInventory":
        console.log("Resetting inventory");
        resetInventory(state);
        break;
      case "subtractInventory":
        console.log(`Subtracting ${effect.amount ?? 1} of ${effect.item} from inventory`);
        subtractInventory(state, effect.item, effect.amount ?? 1);
        break;
      case "addLeviticusKeyIfQualified":
        console.log("Checking if Leviticus key can be added");
        const qualified = addLeviticusKeyIfQualified(state);
        if (!qualified) {
          // If not qualified, force scene change
          state.scene = "not-qualified";
        }
        break;
      case "addTrait":
        console.log(`Adding ${effect.amount ?? 1} of ${effect.item} to traits`);
        addTrait(state, effect.item, effect.amount ?? 1);
        break;
      case "resetTraits":
        console.log("Resetting traits");
        resetTraits(state);
        break;
      case "subtractTraits":
        console.log(`Subtracting ${effect.amount ?? 1} of ${effect.item} from traits`);
        subtractTraits(state, effect.item, effect.amount ?? 1);
        break;
      // Add more effect types as needed
      default:
        // Unknown effect type, do nothing or log
        console.error(`Unknown effect type: ${effect.type}`);
        break;
    }
  };
}

// Load scenes.json and parse effects
async function loadScenes(): Promise<Scene[]> {
  const res = await fetch('scenes.json');
  const data = await res.json();
  return data.map((scene: any) => ({
    ...scene,
    options: scene.options.map((opt: any) => ({
      ...opt,
      effect: parseEffect(opt.effect)
    }))
  }));
}

// Bible verse fetcher
async function fetchBibleVerse(reference: Scene["bibleVerse"]): Promise<string> {
  if (!reference || !reference.book || !reference.chapter || !reference.verses) return '';
  try {
    const res = await fetch(`https://bible.helloao.org/api/ENGWEBP/${reference.book}/${reference.chapter}.json`);
    const data = await res.json();
    const versesArr = data?.chapter?.content?.filter((v: any) => reference.verses.includes(v.number));
    if (!versesArr) return '';
    const verseText = versesArr.map((v: any) => v.content.map((t: any) => (typeof t === 'string' ? t : '')).join(' ')).join(' ');
    const chapter = reference.chapter.toString();
    const verse = reference.verses.join(', ');
    return `<span class='bible-ref'>Exodus ${chapter}:${verse}</span> — <span class='bible-text'>${verseText}</span>`;
  } catch {
    return '';
  }
}

// Filter options for staff logic
function filterOptions(scene: Scene, state: GameState) {
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

// Main App
const App = () => {
  const [game, setGame] = useState<ExodusGame | null>(null);
  const [scenes, setScenes] = useState<Record<string, Scene>>({});
  const [sceneId, setSceneId] = useState<string>('home');
  const [state, setState] = useState<GameState | null>(null);
  const [bibleVerse, setBibleVerse] = useState<string>('');
  // Add state for the full chapter data
  const [chapterData, setChapterData] = useState<any>(null);

  // Load scenes and initialize game
  useEffect(() => {
    loadScenes().then(scenesArr => {
      const scenesObj = Object.fromEntries(scenesArr.map(s => [s.id, s]));
      setScenes(scenesObj);
      const g = new ExodusGame(scenesArr, 'home');
      setGame(g);
      setState(g.getState());
    });
  }, []);

  // Update bible verse and chapter data on scene change
  useEffect(() => {
    if (!scenes[sceneId]) return;
    if (scenes[sceneId].bibleVerse) {
      fetchBibleVerse(scenes[sceneId].bibleVerse).then(setBibleVerse);
      // Fetch the full chapter JSON for the modal
      fetch(`https://bible.helloao.org/api/ENGWEBP/Exodus/${scenes[sceneId].bibleVerse.chapter}.json`)
        .then(res => res.json())
        .then(setChapterData);
    } else {
      setBibleVerse('');
      setChapterData(null);
    }
  }, [sceneId, scenes]);

  if (!game || !state) return <div>Loading Exodus Adventure...</div>;
  const scene = scenes[sceneId];
  if (!scene) return <div>Scene not found.</div>;
  const filteredOptions = filterOptions(scene, state);

  // Option click handler
  function handleOption(i: number) {
    if (!game) return;
    // Find index in original options array
    const optionIndex = scene.options.findIndex(opt => opt.text === filteredOptions[i].text);
    game.chooseOption(optionIndex);
    setState(game.getState());
    setSceneId(game.getState().scene);
  }

  // Debug mode
  const isDev = (import.meta as any).env && (import.meta as any).env.MODE === 'development';

  return (
    <>
      <Header inventory={state.inventory} isDev={isDev} scene={scene} />
      <GameContainer
        scene={scene}
        filteredOptions={filteredOptions}
        onOption={handleOption}
        bibleVerse={bibleVerse}
        chapterData={chapterData}
      />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
