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

export function AlgorithmSelector({ selectAlgorithm, selectedAlgorithm }) {
  // Flatten the algorithms array for easier lookup
  const allAlgorithms = algorithms.flat();

  const handleValueChange = (algorithmName: string) => {
    const algo = allAlgorithms.find((a) => a.name === algorithmName);
    if (algo) {
      selectAlgorithm(algo);
    }
  };

  return (
    <Select value={selectedAlgorithm?.name} onValueChange={handleValueChange}>
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
