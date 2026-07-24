<script lang="ts">
	import Fa from 'svelte-fa';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import PersonCard from '$lib/components/PersonCard.svelte';
	import PersonCardSkeleton from '$lib/components/PersonCardSkeleton.svelte';
	import DocumentCard from '$lib/components/DocumentCard.svelte';
	import DocumentCardSkeleton from '$lib/components/DocumentCardSkeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { faUserTie, faFileLines, faArrowRight, faMagnifyingGlass } from '$lib/icons';
	import { formatNumber } from '$lib/congress/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.q ? `Search: ${data.q}` : 'Search'} | Open Congress</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<header class="mb-8">
		<h1 class="text-3xl font-800 text-gray-900">Search</h1>
		{#if data.q}
			<p class="mt-1 text-gray-500">Results for "{data.q}"</p>
		{/if}
		<div class="mt-5 max-w-2xl">
			<SearchBar action="/search" value={data.q} placeholder="Search legislators or bills..." large />
		</div>
	</header>

	{#if !data.q}
		<EmptyState
			icon={faMagnifyingGlass}
			title="Search Philippine legislative data"
			message="Type a name to find legislators, or a keyword to find bills across every Congress."
		/>
	{:else}
		<section class="mb-12">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="flex items-center gap-2 text-xl font-700 text-gray-900">
					<Fa icon={faUserTie} class="text-primary-600" /> Legislators
				</h2>
				{#await data.people then people}
					{#if people.total > 0}
						<a
							href="/people?q={encodeURIComponent(data.q)}"
							class="inline-flex items-center gap-1.5 text-sm font-600 text-primary-600 hover:text-primary-700"
						>
							See all {formatNumber(people.total)} <Fa icon={faArrowRight} class="text-xs" />
						</a>
					{/if}
				{/await}
			</div>
			{#await data.people}
				<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each Array(3) as _, i (i)}
						<PersonCardSkeleton />
					{/each}
				</div>
			{:then people}
				{#if people.data.length > 0}
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each people.data as person (person.id)}
							<PersonCard {person} />
						{/each}
					</div>
				{:else}
					<EmptyState
						compact
						icon={faUserTie}
						title="No legislators"
						message={`No legislators match "${data.q}".`}
					/>
				{/if}
			{/await}
		</section>

		<section>
			<div class="mb-4 flex items-center justify-between">
				<h2 class="flex items-center gap-2 text-xl font-700 text-gray-900">
					<Fa icon={faFileLines} class="text-primary-600" /> Bills
				</h2>
				{#await data.documents then documents}
					{#if documents.total > 0}
						<a
							href="/documents?q={encodeURIComponent(data.q)}"
							class="inline-flex items-center gap-1.5 text-sm font-600 text-primary-600 hover:text-primary-700"
						>
							See all {formatNumber(documents.total)} <Fa icon={faArrowRight} class="text-xs" />
						</a>
					{/if}
				{/await}
			</div>
			{#await data.documents}
				<div class="grid gap-4 md:grid-cols-2">
					{#each Array(4) as _, i (i)}
						<DocumentCardSkeleton />
					{/each}
				</div>
			{:then documents}
				{#if documents.data.length > 0}
					<div class="grid gap-4 md:grid-cols-2">
						{#each documents.data as document (document.id)}
							<DocumentCard {document} />
						{/each}
					</div>
				{:else}
					<EmptyState
						compact
						icon={faFileLines}
						title="No bills"
						message={`No bills match "${data.q}".`}
					/>
				{/if}
			{/await}
		</section>
	{/if}
</div>
