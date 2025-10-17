import { ClockIcon } from "lucide-react";

export function SortTimer({ time }: { time: number }) {
  const format = (ms: number) =>
    ms < 1000
      ? `${ms}ms`
      : ms < 60000
        ? `${(ms / 1000).toFixed(2)}s`
        : `${Math.floor(ms / 60000)}m ${((ms % 60000) / 1000).toFixed(2)}s`;
  return (
    <div className="flex items-center gap-2">
      <ClockIcon className="h-4 w-4" />
      <span className="text-sm font-mono">{format(time)}</span>
    </div>
  );
}
