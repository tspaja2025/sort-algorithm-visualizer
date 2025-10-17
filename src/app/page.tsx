"use client";

import { Suspense } from "react";
import { Loading } from "@/components/sorting/Loading";
import { SortingVisualizer } from "@/components/sorting/SortingVisualizer";
import { VisualizationErrorBoundary } from "@/components/sorting/VisualizationErrorBoundary";

export default function Home() {
  return (
    <VisualizationErrorBoundary>
      <Suspense fallback={<Loading />}>
        <SortingVisualizer />
      </Suspense>
    </VisualizationErrorBoundary>
  );
}
