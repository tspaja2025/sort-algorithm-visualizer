import { ClockIcon } from "lucide-react";

export function SortTimer({ time }: { time: number }) {
	const formatTime = (ms: number) => {
		if (ms < 1000) {
			return `${ms}ms`;
		} else if (ms < 60000) {
			return `${(ms / 1000).toFixed(2)}s`;
		} else {
			const minutes = Math.floor(ms / 60000);
			const seconds = ((ms % 60000) / 1000).toFixed(2);
			return `${minutes}m ${seconds}s`;
		}
	};

	return (
		<div className="flex items-center gap-2">
			<ClockIcon className="h-4 w-4" />
			<span className="text-sm font-mono">{formatTime(time)}</span>
		</div>
	);
}
