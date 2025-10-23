"use client";

import { Loading } from "@/components/sorting/Loading";
import { SortingVisualizer } from "@/components/sorting/SortingVisualizer";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <SortingVisualizer />
    </Suspense>
  );
}
