<script lang="ts">
	import Fa from 'svelte-fa';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import PersonCardSkeleton from '$lib/components/PersonCardSkeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { faUserTie, faCalendarDays, faArrowRight } from '$lib/icons';
	import { formatDate, formatNumber } from '$lib/congress/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const current = $derived(data.current);
</script>

<svelte:head>
	<title>Senators | Open Congress</title>
	<meta
		name="description"
		content="The sitting senators of the current Congress of the Philippines."
	/>
</svelte:head>

<div class="border-b border-gray-200 bg-surface">
	<div class="mx-auto max-w-6xl px-4 py-10">
		<div class="flex flex-wrap items-center gap-3">
			<span class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:text-primary-300">
				<Fa icon={faUserTie} class="text-2xl" />
			</span>
			<div>
				<div class="flex flex-wrap items-center gap-2">
					<h1 class="text-2xl font-800 text-gray-900 sm:text-3xl">Senators</h1>
					{#if current.end_date === null}
						<Badge tone="success">Current</Badge>
					{/if}
				</div>
				<div class="mt-1 flex items-center gap-2 text-sm text-gray-500">
					<Fa icon={faCalendarDays} />
					{current.ordinal} Congress
					{#if current.end_date === null}
						, since {formatDate(current.start_date)}
					{:else}
						, {current.year_range}
					{/if}
				</div>
			</div>
		</div>

		{#if current.total_representatives}
			<p class="mt-6 text-sm text-gray-500">
				This Congress also has {formatNumber(current.total_representatives)} representatives.
				<a
					href="/people?type=representative&congress={current.congress_number}"
					class="inline-flex items-center gap-1.5 font-600 text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
				>
					Browse them <Fa icon={faArrowRight} class="text-xs" />
				</a>
			</p>
		{/if}
	</div>
</div>

<div class="mx-auto max-w-6xl px-4 py-10">
	{#await data.senators}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(9) as _, i (i)}
				<PersonCardSkeleton />
			{/each}
		</div>
	{:then senators}
		{#if senators.data.length > 0}
			<p class="mb-4 text-sm text-gray-500">
				{formatNumber(senators.total)} sitting senators
			</p>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each senators.data as person (person.id)}
					<PersonCard {person} />
				{/each}
			</div>
		{:else}
			<EmptyState
				icon={faUserTie}
				title="No senators listed"
				message="No senator records are available for this Congress."
			/>
		{/if}
	{/await}
</div>
