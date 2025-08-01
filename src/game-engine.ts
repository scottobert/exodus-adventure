// Core game engine for Exodus Adventure
export interface Inventory {
  [item: string]: number;
}

export interface GameState {
  scene: string;
  inventory: Inventory;
  history: string[];
}

export interface Scene {
  id: string;
  description: string;
  options: Array<{
    text: string;
    nextScene: string;
    effect?: (state: GameState) => void;
  }>;
  backgroundImage?: string; // Optional background image for the scene
  bibleVerse?: { book: string, chapter: number; verses: Array<number> }; // Optional Bible verse for the scene
}

export class ExodusGame {
  private state: GameState;
  private scenes: Record<string, Scene>;

  constructor(scenes: Scene[], initialScene: string) {
    this.scenes = Object.fromEntries(scenes.map(s => [s.id, s]));
    this.state = { scene: initialScene, inventory: {}, history: [] };
  }

  getCurrentScene(): Scene {
    return this.scenes[this.state.scene];
  }

  chooseOption(index: number): void {
    const scene = this.getCurrentScene();
    const option = scene.options[index];
    const prevScene = this.state.scene;
    if (option.effect) option.effect(this.state);
    this.state.history.push(scene.id);
    // Only set nextScene if the effect did not change it
    if (this.state.scene === prevScene) {
      this.state.scene = option.nextScene;
    }
}

  getState(): GameState {
    return { ...this.state };
  }
}
