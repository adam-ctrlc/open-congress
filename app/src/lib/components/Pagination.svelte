<script lang="ts">
	import Fa from 'svelte-fa';
	import { faArrowLeftLong, faArrowRightLong, faArrowRightToBracket } from '$lib/icons';

	let {
		basePath,
		params = {},
		limit,
		page,
		total
	}: {
		basePath: string;
		params?: Record<string, string | undefined>;
		limit: number;
		page: number;
		total: number;
	} = $props();

	const totalPages = $derived(Math.max(1, Math.ceil(total / limit)));
	const current = $derived(Math.min(Math.max(1, page), totalPages));

	const items = $derived.by(() => {
		const out: (number | 'gap')[] = [];
		for (let page = 1; page <= totalPages; page++) {
			if (page === 1 || page === totalPages || (page >= current - 1 && page <= current + 1)) {
				out.push(page);
			} else if (out[out.length - 1] !== 'gap') {
				out.push('gap');
			}
		}
		return out;
	});

	function pageUrl(target: number): string {
		const search = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value) search.set(key, value);
		}
		// Page 1 is the canonical bare URL, so it carries no page parameter.
		if (target > 1) search.set('page', String(target));
		const query = search.toString();
		return query ? `${basePath}?${query}` : basePath;
	}
</script>

{#if totalPages > 1}
	<nav class="mt-8 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pagination">
		{#if current > 1}
			<a
				href={pageUrl(current - 1)}
				class="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-surface px-3 text-sm font-600 text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
				aria-label="Previous page"
			>
				<Fa icon={faArrowLeftLong} class="text-xs" />
				<span class="hidden sm:inline">Prev</span>
			</a>
		{/if}

		{#each items as item, i (i)}
			{#if item === 'gap'}
				<span class="flex h-9 w-9 items-center justify-center text-gray-400">...</span>
			{:else if item === current}
				<span
					class="flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary-600 px-2 text-sm font-700 text-white"
					aria-current="page"
				>
					{item}
				</span>
			{:else}
				<a
					href={pageUrl(item)}
					class="flex h-9 min-w-9 items-center justify-center rounded-lg border border-gray-200 bg-surface px-2 text-sm font-600 text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
				>
					{item}
				</a>
			{/if}
		{/each}

		{#if current < totalPages}
			<a
				href={pageUrl(current + 1)}
				class="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-surface px-3 text-sm font-600 text-gray-600 transition-colors hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
				aria-label="Next page"
			>
				<span class="hidden sm:inline">Next</span>
				<Fa icon={faArrowRightLong} class="text-xs" />
			</a>
		{/if}
	</nav>

	<!-- Plain GET form: submitting navigates to ?page=N with no client-side code.
	     Hidden fields carry the active search, sort and filters across the jump. -->
	<form
		method="GET"
		action={basePath}
		class="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500"
	>
		{#each Object.entries(params) as [key, value] (key)}
			{#if value}
				<input type="hidden" name={key} value={value} />
			{/if}
		{/each}

		<label class="flex items-center gap-2">
			<span>Go to page</span>
			<input
				type="number"
				name="page"
				value={current}
				min="1"
				max={totalPages}
				step="1"
				inputmode="numeric"
				aria-label="Page number, between 1 and {totalPages}"
				class="h-9 w-20 rounded-lg border-gray-200 bg-surface px-2 text-center text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
			/>
		</label>
		<span>of {totalPages}</span>
		<button
			type="submit"
			class="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-surface px-3 text-sm font-600 text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
		>
			<Fa icon={faArrowRightToBracket} class="text-xs" />
			Go
		</button>
	</form>
{/if}
