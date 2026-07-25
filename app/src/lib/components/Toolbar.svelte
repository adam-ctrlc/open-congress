<script lang="ts">
	import Fa from 'svelte-fa';
	import { faMagnifyingGlass, faArrowDownWideShort } from '$lib/icons';
	import type { SortOption } from '$lib/congress/sort';

	interface Filter {
		name: string;
		value: string;
		label: string;
		options: { value: string; label: string }[];
	}

	let {
		action,
		q = null,
		searchPlaceholder = 'Search...',
		sort,
		sortOptions,
		filters = [],
		dateFrom = null,
		dateTo = null
	}: {
		action: string;
		q?: string | null;
		searchPlaceholder?: string;
		sort: string;
		sortOptions: SortOption[];
		filters?: Filter[];
		dateFrom?: string | null;
		dateTo?: string | null;
	} = $props();

	function submit(event: Event): void {
		(event.currentTarget as HTMLElement).closest('form')?.requestSubmit();
	}
</script>

<form
	method="GET"
	{action}
	class="grid grid-cols-1 items-center gap-3 sm:grid-cols-2 lg:grid-cols-4"
>
	{#if q !== null}
		<div class="relative min-w-0 sm:col-span-2">
			<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
				<Fa icon={faMagnifyingGlass} class="text-sm" />
			</span>
			<input
				type="search"
				name="q"
				value={q}
				placeholder={searchPlaceholder}
				autocomplete="off"
				class="w-full rounded-lg border-gray-200 bg-surface py-2.5 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500"
			/>
		</div>
	{/if}

	{#each filters as filter (filter.name)}
		<select
			name={filter.name}
			value={filter.value}
			aria-label={filter.label}
			onchange={submit}
			class="w-full min-w-0 cursor-pointer rounded-lg border-gray-200 bg-surface py-2.5 pl-3 pr-9 text-sm font-500 text-gray-700 focus:border-primary-500 focus:ring-primary-500"
		>
			{#each filter.options as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	{/each}

	{#if dateFrom !== null && dateTo !== null}
		<div class="flex min-w-0 items-center gap-2 sm:col-span-2">
			<input
				type="date"
				name="date_from"
				value={dateFrom}
				aria-label="Filed from"
				onchange={submit}
				class="w-full min-w-0 rounded-lg border-gray-200 bg-surface px-3 py-2.5 text-sm text-gray-700 focus:border-primary-500 focus:ring-primary-500"
			/>
			<span class="shrink-0 text-sm text-gray-400">to</span>
			<input
				type="date"
				name="date_to"
				value={dateTo}
				aria-label="Filed to"
				onchange={submit}
				class="w-full min-w-0 rounded-lg border-gray-200 bg-surface px-3 py-2.5 text-sm text-gray-700 focus:border-primary-500 focus:ring-primary-500"
			/>
		</div>
	{/if}

	<div class="relative min-w-0">
		<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
			<Fa icon={faArrowDownWideShort} class="text-sm" />
		</span>
		<select
			name="sort"
			value={sort}
			aria-label="Sort"
			onchange={submit}
			class="w-full min-w-0 cursor-pointer rounded-lg border-gray-200 bg-surface py-2.5 pl-9 pr-9 text-sm font-500 text-gray-700 focus:border-primary-500 focus:ring-primary-500"
		>
			{#each sortOptions as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
</form>
