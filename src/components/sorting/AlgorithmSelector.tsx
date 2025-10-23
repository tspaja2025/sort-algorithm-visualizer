"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { algorithms } from "@/lib/sort-algorithms";
import { AlgorithmSelectorProps } from "@/lib/types";
import React, { useMemo, useState } from "react";

export function AlgorithmSelector({
  selectAlgorithmAction,
  selectedAlgorithm,
}: AlgorithmSelectorProps) {
  const [search, setSearch] = useState("");
  const allAlgorithms = useMemo(() => algorithms.flat(), []);

  const filtered = useMemo(() => {
    if (!search) return algorithms;
    return algorithms
      .map((g) =>
        g.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())),
      )
      .filter((g) => g.length > 0);
  }, [search]);

  return (
    <Select
      value={selectedAlgorithm?.name || ""}
      onValueChange={(v) => {
        const algo = allAlgorithms.find((a) => a.name === v);
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {filtered.map((group) => (
          <React.Fragment key={group[0]?.name || Math.random()}>
            <SelectSeparator />
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
