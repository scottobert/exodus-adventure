import type { Scene } from './game-engine';
import { SceneDescription } from './SceneDescription';
import { Options } from './Options';
import { BibleVerse } from './BibleVerse';

type Props = {
  scene: Scene;
  filteredOptions: Scene['options'];
  onOption: (i: number) => void;
  bibleVerse: string;
  chapterData?: any;
};

export function GameContainer({ scene, filteredOptions, onOption, bibleVerse, chapterData }: Props) {
  return (
    <div className="game-container">
      {scene.backgroundImage && (
        <div className="scene-background">
          <img src={scene.backgroundImage} alt="Scene background" />
        </div>
      )}
      <SceneDescription description={scene.description} />
      <Options options={filteredOptions} onOption={onOption} />
      {/* Spacer to push BibleVerse to the bottom */}
      <div style={{ flex: 1 }} />
      <BibleVerse html={bibleVerse} chapterData={chapterData} />
    </div>
  );
}
