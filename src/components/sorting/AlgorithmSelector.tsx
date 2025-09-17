'use client';

import { algorithms } from '@/lib/sort-algorithms/index';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import React, { useMemo, useState } from 'react';
import { AlgorithmSelectorProps } from '@/lib/types';

export function AlgorithmSelector({
  selectAlgorithmAction,
  selectedAlgorithm,
}: AlgorithmSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const allAlgorithms = useMemo(() => algorithms.flat(), []);

  const filteredAlgorithms = useMemo(() => {
    if (!searchTerm) return algorithms;
    return algorithms
      .map((group) =>
        group.filter((algo) =>
          algo.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter((group) => group.length > 0);
  }, [searchTerm]);

  return (
    <Select
      value={selectedAlgorithm?.name || ''}
      onValueChange={(value) => {
        const algo = allAlgorithms.find((a) => a.name === value);
        if (algo) selectAlgorithmAction(algo);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an Algorithm" />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder="Search algorithms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {filteredAlgorithms.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {groupIndex > 0 && <SelectSeparator />}
            {group.map((algo) => (
              <SelectItem key={algo.name} value={algo.name}>
                {algo.name}
              </SelectItem>
            ))}
          </React.Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}
