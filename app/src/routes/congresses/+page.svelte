<script lang="ts">
	import Fa from 'svelte-fa';
	import Badge from '$lib/components/Badge.svelte';
	import { faBuildingColumns, faCalendarDays, faUserTie, faUsers } from '$lib/icons';
	import { formatDate, formatNumber } from '$lib/congress/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Congresses | Open Congress</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<header class="mb-8">
		<h1 class="text-3xl font-800 text-gray-900">Congresses</h1>
		<p class="mt-1 text-gray-500">Every Congress of the Philippines on record.</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each data.congresses as item (item.id)}
			<a
				href="/congresses/{item.id}"
				class="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
			>
				<div class="flex items-center justify-between">
					<span class="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
						<Fa icon={faBuildingColumns} class="text-lg" />
					</span>
					{#if item.end_date == null}
						<Badge tone="success">Current</Badge>
					{/if}
				</div>
				<h2 class="mt-4 text-lg font-700 text-gray-900 group-hover:text-primary-700">
					{item.ordinal} Congress
				</h2>
				<div class="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
					<Fa icon={faCalendarDays} />
					{#if item.end_date == null}
						{formatDate(item.start_date)} to present
					{:else}
						{item.year_range}
					{/if}
				</div>
				{#if item.total_senators || item.total_representatives}
					<div class="mt-3 flex flex-wrap gap-3 border-t border-gray-100 pt-3 text-xs font-600 text-gray-500">
						{#if item.total_senators}
							<span class="inline-flex items-center gap-1.5">
								<Fa icon={faUserTie} class="text-gray-400" />
								{formatNumber(item.total_senators)} senators
							</span>
						{/if}
						{#if item.total_representatives}
							<span class="inline-flex items-center gap-1.5">
								<Fa icon={faUsers} class="text-gray-400" />
								{formatNumber(item.total_representatives)} reps
							</span>
						{/if}
					</div>
				{/if}
			</a>
		{/each}
	</div>
</div>
