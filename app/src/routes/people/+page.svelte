<script lang="ts">
	import PersonCard from '$lib/components/PersonCard.svelte';
	import PersonCardSkeleton from '$lib/components/PersonCardSkeleton.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { faUserTie } from '$lib/icons';
	import { formatNumber } from '$lib/congress/format';
	import { peopleSorts } from '$lib/congress/sort';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const chamberOptions = [
		{ value: '', label: 'All chambers' },
		{ value: 'senator', label: 'Senators' },
		{ value: 'representative', label: 'Representatives' }
	];

	const congressOptions = $derived([
		{ value: '', label: 'All congresses' },
		...data.congresses.map((item) => ({
			value: String(item.congress_number),
			label: `${item.ordinal} Congress`
		}))
	]);
</script>

<svelte:head>
	<title>Legislators | Open Congress</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<header class="mb-8">
		<h1 class="mb-5 text-3xl font-800 text-gray-900">Legislators</h1>
		<Toolbar
			action="/people"
			q={data.q}
			searchPlaceholder="Search legislators by name..."
			sort={data.sort}
			sortOptions={peopleSorts}
			filters={[
				{ name: 'type', value: data.type, label: 'Chamber', options: chamberOptions },
				{ name: 'congress', value: data.congress, label: 'Congress', options: congressOptions }
			]}
		/>
	</header>

	{#await data.result}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(9) as _, i (i)}
				<PersonCardSkeleton />
			{/each}
		</div>
	{:then result}
		{#if result.people.length > 0}
			<p class="mb-4 text-sm text-gray-500">
				{formatNumber(result.pagination?.total ?? result.people.length)}
				{data.q ? `results for "${data.q}"` : 'legislators'}
			</p>
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each result.people as person (person.id)}
					<PersonCard {person} />
				{/each}
			</div>
			<Pagination
				basePath="/people"
				params={{ q: data.q, sort: data.sort, type: data.type, congress: data.congress }}
				limit={data.limit}
				offset={data.offset}
				total={result.pagination?.total ?? result.people.length}
			/>
		{:else}
			<EmptyState
				icon={faUserTie}
				title="No legislators found"
				message={data.q
					? `Nothing matched "${data.q}". Try another name or filter.`
					: 'No legislators match these filters.'}
			/>
		{/if}
	{/await}
</div>
