// Core game engine for Exodus Adventure
export interface GameState {
  scene: string;
  inventory: string[];
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
}

export class ExodusGame {
  private state: GameState;
  private scenes: Record<string, Scene>;

  constructor(scenes: Scene[], initialScene: string) {
    this.scenes = Object.fromEntries(scenes.map(s => [s.id, s]));
    this.state = { scene: initialScene, inventory: [], history: [] };
  }

  getCurrentScene(): Scene {
    return this.scenes[this.state.scene];
  }

  chooseOption(index: number): void {
    const scene = this.getCurrentScene();
    const option = scene.options[index];
    if (option.effect) option.effect(this.state);
    this.state.history.push(scene.id);
    this.state.scene = option.nextScene;
  }

  getState(): GameState {
    return { ...this.state };
  }
}
