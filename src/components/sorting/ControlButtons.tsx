"use client";

import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import type { variantType } from "@/lib/types";

export function ControlButtons({
  size,
  stepAction,
  resetAction,
}: {
  size: number;
  stepAction: () => void;
  resetAction: () => void;
}) {
  const { arrayToSort, running, setRunning, setArrayToSort, regenerateArray } =
    useStore();

  const toggle = () => setRunning(!running);

  const reverse = () => {
    setArrayToSort([...arrayToSort].reverse());
    resetAction();
  };

  const shuffleClick = () => {
    regenerateArray(size);
    resetAction();
  };

  const sortByParity = () => {
    const sorted = [...arrayToSort].sort((a, b) => a - b);
    const [odds, evens] = sorted.reduce<[number[], number[]]>(
      ([o, e], v) => (v % 2 === 0 ? [o, [...e, v]] : [[...o, v], e]),
      [[], []],
    );
    return { odds, evens };
  };

  const valley = () => {
    const { odds, evens } = sortByParity();
    setArrayToSort([...odds.reverse(), ...evens]);
    resetAction();
  };

  const mountain = () => {
    const { odds, evens } = sortByParity();
    setArrayToSort([...odds, ...evens.reverse()]);
    resetAction();
  };

  const BUTTONS = [
    {
      key: "start",
      label: running ? "Stop" : "Start",
      variant: running ? "secondary" : "default",
      onClick: toggle,
    },
    { key: "step", label: "Step", onClick: stepAction },
    { key: "shuffle", label: "Shuffle", onClick: shuffleClick },
    { key: "reverse", label: "Reverse", onClick: reverse },
    { key: "valley", label: "Valley", onClick: valley },
    { key: "mountain", label: "Mountain", onClick: mountain },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {BUTTONS.map(({ key, label, variant, onClick }) => (
        <Button key={key} variant={variant as variantType} onClick={onClick}>
          {label}
        </Button>
      ))}
    </div>
  );
}
