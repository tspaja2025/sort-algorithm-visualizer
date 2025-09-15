import { Suspense } from 'react';
import SortingVisualizer from '@/components/sorting/SortingVisualizer';
import Loading from '@/components/loading';

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <SortingVisualizer />
    </Suspense>
  );
}