import React from 'react';
import type { Scene, GameState } from './game-engine';
import { SceneDescription } from './SceneDescription';
import { Options } from './Options';
import { BibleVerse } from './BibleVerse';

type Props = {
  scene: Scene;
  filteredOptions: Scene['options'];
  onOption: (i: number) => void;
  bibleVerse: string;
  isDev: boolean;
};

export function GameContainer({ scene, filteredOptions, onOption, bibleVerse, isDev }: Props) {
  return (
    <div className="game-container">
      {isDev && <div className="scene-id-debug">{scene.id}</div>}
      {scene.backgroundImage && (
        <div className="scene-background">
          <img src={scene.backgroundImage} alt="Scene background" />
        </div>
      )}
      <SceneDescription description={scene.description} />
      <Options options={filteredOptions} onOption={onOption} />
      <BibleVerse html={bibleVerse} />
    </div>
  );
}
