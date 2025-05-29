import type { Scene } from './game-engine';

type Props = {
  options: Scene['options'];
  onOption: (i: number) => void;
};

export function Options({ options, onOption }: Props) {
  return (
    <div className="options">
      {options.map((opt, i) => (
        <button key={i} onClick={() => onOption(i)}>{opt.text}</button>
      ))}
    </div>
  );
}
