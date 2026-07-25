<script lang="ts">
	import Fa from 'svelte-fa';
	import { faTable, faChevronRight } from '$lib/icons';
	import { formatNumber } from '$lib/congress/format';
	import type { CongressBreakdown } from '$lib/congress/types';

	let { rows }: { rows: CongressBreakdown[] } = $props();

	const SERIES = [
		{ key: 'house_bills' as const, label: 'House bills', color: '#0066eb' },
		{ key: 'senate_bills' as const, label: 'Senate bills', color: '#ff4d00' }
	];

	const W = 800;
	const H = 320;
	const PAD = { top: 16, right: 16, bottom: 40, left: 60 };
	const INNER_W = W - PAD.left - PAD.right;
	const INNER_H = H - PAD.top - PAD.bottom;
	const SEGMENT_GAP = 2;

	const data = $derived([...rows].sort((a, b) => a.congress - b.congress));
	const maxTotal = $derived(Math.max(1, ...data.map((row) => row.total)));

	const ticks = $derived.by(() => {
		const step = maxTotal / 4;
		return [0, 1, 2, 3, 4].map((i) => Math.round(step * i));
	});

	const band = $derived(INNER_W / Math.max(1, data.length));
	const barWidth = $derived(Math.min(40, band * 0.62));

	let hovered = $state<number | null>(null);

	function y(value: number): number {
		return PAD.top + INNER_H - (value / maxTotal) * INNER_H;
	}

	function bandCenter(index: number): number {
		return PAD.left + band * index + band / 2;
	}

	function roundedTop(x: number, top: number, width: number, height: number): string {
		const r = Math.min(4, width / 2, Math.max(0, height));
		const bottom = top + height;
		return `M${x},${bottom} L${x},${top + r} Q${x},${top} ${x + r},${top} L${x + width - r},${top} Q${x + width},${top} ${x + width},${top + r} L${x + width},${bottom} Z`;
	}

	function segments(row: CongressBreakdown) {
		const out: { key: string; color: string; x: number; top: number; height: number; rounded: boolean }[] = [];
		let cursor = 0;
		SERIES.forEach((series, i) => {
			const value = row[series.key];
			if (value <= 0) return;
			const baseY = y(cursor);
			const topY = y(cursor + value);
			const isTop = i === SERIES.length - 1 || row[SERIES[SERIES.length - 1].key] <= 0;
			const height = Math.max(0, baseY - topY - (isTop ? 0 : SEGMENT_GAP));
			out.push({ key: series.key, color: series.color, x: 0, top: topY, height, rounded: isTop });
			cursor += value;
		});
		return out;
	}
</script>

<figure class="rounded-xl border border-gray-200 bg-surface p-5 shadow-sm">
	<figcaption class="mb-1 text-lg font-700 text-gray-900">Bills filed per Congress</figcaption>
	<p class="mb-4 text-sm text-gray-500">
		House and Senate bills recorded for each Congress in the dataset.
	</p>

	<div class="mb-4 flex flex-wrap gap-4">
		{#each SERIES as series (series.key)}
			<span class="inline-flex items-center gap-2 text-sm font-600 text-gray-600">
				<span class="h-2.5 w-2.5 rounded-sm" style="background:{series.color}"></span>
				{series.label}
			</span>
		{/each}
	</div>

	<div class="relative">
		<svg
			viewBox="0 0 {W} {H}"
			class="w-full"
			role="img"
			aria-label="Stacked bar chart of House and Senate bills filed per Congress"
		>
			{#each ticks as tick (tick)}
				<line
					x1={PAD.left}
					x2={W - PAD.right}
					y1={y(tick)}
					y2={y(tick)}
					stroke="currentColor" class="text-gray-200"
					stroke-width="1"
				/>
				<text x={PAD.left - 10} y={y(tick) + 4} text-anchor="end" font-size="11" fill="currentColor" class="text-gray-400">
					{tick >= 1000 ? `${Math.round(tick / 1000)}k` : tick}
				</text>
			{/each}

			{#each data as row, i (row.congress)}
				{@const cx = bandCenter(i)}
				<g
					role="graphics-symbol"
					aria-label="{row.congress}th Congress: {formatNumber(row.total)} bills"
					onmouseenter={() => (hovered = i)}
					onmouseleave={() => (hovered = null)}
				>
					<rect
						x={cx - band / 2}
						y={PAD.top}
						width={band}
						height={INNER_H}
						fill="currentColor"
					class={hovered === i ? 'text-gray-100' : 'text-transparent'}
					/>
					{#each segments(row) as segment (segment.key)}
						{#if segment.rounded}
							<path
								d={roundedTop(cx - barWidth / 2, segment.top, barWidth, segment.height)}
								fill={segment.color}
							/>
						{:else}
							<rect
								x={cx - barWidth / 2}
								y={segment.top}
								width={barWidth}
								height={segment.height}
								fill={segment.color}
							/>
						{/if}
					{/each}
					<text x={cx} y={H - PAD.bottom + 18} text-anchor="middle" font-size="11" fill="currentColor" class="text-gray-500">
						{row.congress}
					</text>
				</g>
			{/each}

			<text
				x={PAD.left + INNER_W / 2}
				y={H - 6}
				text-anchor="middle"
				font-size="11"
				fill="currentColor" class="text-gray-400"
			>
				Congress
			</text>
		</svg>

		{#if hovered !== null}
			{@const row = data[hovered]}
			<div
				class="pointer-events-none absolute top-2 z-10 w-max rounded-lg border border-gray-200 bg-surface p-3 text-sm shadow-lg"
				style="left: {(bandCenter(hovered) / W) * 100}%; transform: translateX(-50%)"
			>
				<div class="mb-1.5 font-700 text-gray-900">{row.congress}th Congress</div>
				{#each SERIES as series (series.key)}
					<div class="flex items-center justify-between gap-4">
						<span class="inline-flex items-center gap-1.5 text-gray-600">
							<span class="h-2 w-2 rounded-sm" style="background:{series.color}"></span>
							{series.label}
						</span>
						<span class="font-600 text-gray-900">{formatNumber(row[series.key])}</span>
					</div>
				{/each}
				<div class="mt-1.5 flex items-center justify-between gap-4 border-t border-gray-100 pt-1.5">
					<span class="text-gray-600">Total</span>
					<span class="font-700 text-gray-900">{formatNumber(row.total)}</span>
				</div>
			</div>
		{/if}
	</div>

	<details class="group mt-5 border-t border-gray-100 pt-4">
		<summary
			class="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg border border-gray-200 bg-surface px-3 py-2 text-sm font-600 text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-200 group-open:border-primary-300 group-open:bg-primary-50 group-open:text-primary-700 dark:group-open:text-primary-200 [&::-webkit-details-marker]:hidden"
		>
			<Fa icon={faTable} class="text-gray-400 group-open:text-primary-500" />
			<span class="group-open:hidden">View as table</span>
			<span class="hidden group-open:inline">Viewing as table</span>
			<Fa icon={faChevronRight} class="text-xs transition-transform group-open:rotate-90" />
		</summary>
		<div class="mt-3 overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
						<th scope="col" class="py-2 pr-4 font-600">Congress</th>
						<th scope="col" class="py-2 pr-4 font-600">House</th>
						<th scope="col" class="py-2 pr-4 font-600">Senate</th>
						<th scope="col" class="py-2 font-600">Total</th>
					</tr>
				</thead>
				<tbody>
					{#each data as row (row.congress)}
						<tr class="border-b border-gray-100">
							<th scope="row" class="py-2 pr-4 font-600 text-gray-900">{row.congress}th</th>
							<td class="py-2 pr-4 text-gray-600">{formatNumber(row.house_bills)}</td>
							<td class="py-2 pr-4 text-gray-600">{formatNumber(row.senate_bills)}</td>
							<td class="py-2 font-600 text-gray-900">{formatNumber(row.total)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</details>
</figure>
