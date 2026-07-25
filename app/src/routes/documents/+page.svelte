<script lang="ts">
	import DocumentCard from '$lib/components/DocumentCard.svelte';
	import DocumentCardSkeleton from '$lib/components/DocumentCardSkeleton.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { faFileLines } from '$lib/icons';
	import { formatNumber } from '$lib/congress/format';
	import { documentSorts } from '$lib/congress/sort';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const chamberOptions = [
		{ value: '', label: 'All chambers' },
		{ value: 'SB', label: 'Senate bills' },
		{ value: 'HB', label: 'House bills' }
	];

	const scopeOptions = [
		{ value: '', label: 'All scopes' },
		{ value: 'National', label: 'National' },
		{ value: 'Local', label: 'Local' }
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
	<title>Bills | Open Congress</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">
	<header class="mb-8">
		<h1 class="mb-5 text-3xl font-800 text-gray-900">Bills</h1>
		<Toolbar
			action="/documents"
			q={data.q}
			searchPlaceholder="Search bills by keyword..."
			sort={data.sort}
			sortOptions={documentSorts}
			dateFrom={data.dateFrom}
			dateTo={data.dateTo}
			filters={[
				{ name: 'congress', value: data.congress, label: 'Congress', options: congressOptions },
				{ name: 'type', value: data.type, label: 'Chamber', options: chamberOptions },
				{ name: 'scope', value: data.scope, label: 'Scope', options: scopeOptions }
			]}
		/>
	</header>

	{#await data.result}
		<div class="grid gap-4 md:grid-cols-2">
			{#each Array(8) as _, i (i)}
				<DocumentCardSkeleton />
			{/each}
		</div>
	{:then result}
		{#if result.documents.length > 0}
			<p class="mb-4 text-sm text-gray-500">
				{formatNumber(result.pagination?.total ?? result.documents.length)}
				{data.q ? `results for "${data.q}"` : 'bills'}
			</p>
			<div class="grid gap-4 md:grid-cols-2">
				{#each result.documents as document (document.id)}
					<DocumentCard {document} />
				{/each}
			</div>
			<Pagination
				basePath="/documents"
				params={{
					q: data.q,
					sort: data.sort,
					congress: data.congress,
					type: data.type,
					scope: data.scope,
					date_from: data.dateFrom,
					date_to: data.dateTo
				}}
				limit={data.limit}
				page={data.page}
				total={result.pagination?.total ?? result.documents.length}
			/>
		{:else}
			<EmptyState
				icon={faFileLines}
				title="No bills found"
				message={data.q
					? `Nothing matched "${data.q}". Try another keyword or filter.`
					: 'No bills match these filters.'}
			/>
		{/if}
	{/await}
</div>
