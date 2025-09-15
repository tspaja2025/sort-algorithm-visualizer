'use client';

import { algorithms } from '@/lib/sort-algorithms/index';
import { buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';
import { Algorithm } from '@/lib/types';

export function AlgorithmSelector({
  selectAlgorithmAction,
  selectedAlgorithm,
}: {
  selectAlgorithmAction: (algo: Algorithm) => void;
  selectedAlgorithm: Algorithm | null;
}) {
  const allAlgorithms = algorithms.flat();

  // Provide a default selected algorithm if none is selected
  const selectedAlgorithmName = selectedAlgorithm?.name || '';

  const handleValueChange = (algorithmName: string) => {
    const algo = allAlgorithms.find((a) => a.name === algorithmName);
    if (algo) {
      selectAlgorithmAction(algo);
    }
  };

  return (
    <Select value={selectedAlgorithmName} onValueChange={handleValueChange}>
      <SelectTrigger className={buttonVariants({ variant: 'outline' })}>
        <SelectValue placeholder="Select an Algorithm" />
      </SelectTrigger>
      <SelectContent>
        {algorithms.map((algos, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {algos.map((algo, index) => (
              <SelectItem key={`${groupIndex}-${index}`} value={algo.name}>
                {algo.name}
              </SelectItem>
            ))}
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}
