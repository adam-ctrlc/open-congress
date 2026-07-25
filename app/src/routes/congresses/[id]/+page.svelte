<script lang="ts">
	import Fa from 'svelte-fa';
	import Badge from '$lib/components/Badge.svelte';
	import DocumentCard from '$lib/components/DocumentCard.svelte';
	import DocumentCardSkeleton from '$lib/components/DocumentCardSkeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import {
		faArrowLeftLong,
		faBuildingColumns,
		faCalendarDays,
		faFileLines,
		faUsers
	} from '$lib/icons';
	import { formatDate, formatNumber } from '$lib/congress/format';
	import { documentSorts } from '$lib/congress/sort';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const item = $derived(data.congress);
	const isCurrent = $derived(item.end_date == null);
</script>

<svelte:head>
	<title>{item.ordinal} Congress | Open Congress</title>
</svelte:head>

<div class="border-b border-gray-200 bg-surface">
	<div class="mx-auto max-w-5xl px-4 py-10">
		<a
			href="/congresses"
			class="mb-6 inline-flex items-center gap-2 text-sm font-600 text-gray-500 hover:text-primary-700 dark:hover:text-primary-200"
		>
			<Fa icon={faArrowLeftLong} /> All congresses
		</a>
		<div class="flex flex-wrap items-center gap-3">
			<span class="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:text-primary-300">
				<Fa icon={faBuildingColumns} class="text-2xl" />
			</span>
			<div>
				<h1 class="text-2xl font-800 text-gray-900 sm:text-3xl">{item.ordinal} Congress</h1>
				<div class="mt-1 flex items-center gap-2 text-sm text-gray-500">
					<Fa icon={faCalendarDays} />
					{#if isCurrent}
						{formatDate(item.start_date)} to present
					{:else}
						{item.year_range}
					{/if}
					{#if isCurrent}
						<Badge tone="success">Current</Badge>
					{/if}
				</div>
			</div>
		</div>

		{#if item.total_committees}
			<div class="mt-6 flex flex-wrap gap-3">
				<span class="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-600 text-gray-700">
					<Fa icon={faUsers} class="text-gray-400" /> {formatNumber(item.total_committees)} committees
				</span>
			</div>
		{/if}
	</div>
</div>

<div class="mx-auto max-w-5xl px-4 py-10">
	<h2 class="mb-4 flex items-center gap-2 text-lg font-700 text-gray-900">
		<Fa icon={faFileLines} class="text-primary-600 dark:text-primary-300" /> Bills filed
	</h2>

	<div class="mb-6">
		<Toolbar
			action="/congresses/{item.id}"
			q={data.q}
			searchPlaceholder="Search bills in this Congress..."
			sort={data.sort}
			sortOptions={documentSorts}
		/>
	</div>

	{#await data.documents}
		<div class="grid gap-4 md:grid-cols-2">
			{#each Array(6) as _, i (i)}
				<DocumentCardSkeleton />
			{/each}
		</div>
	{:then documents}
		{#if documents.data.length > 0}
			<p class="mb-4 text-sm text-gray-500">
				{formatNumber(documents.pagination?.total ?? documents.data.length)}
				{data.q ? `results for "${data.q}"` : 'bills in this Congress'}
			</p>
			<div class="grid gap-4 md:grid-cols-2">
				{#each documents.data as document (document.id)}
					<DocumentCard {document} />
				{/each}
			</div>
			<Pagination
				basePath="/congresses/{item.id}"
				params={{ q: data.q, sort: data.sort }}
				limit={data.limit}
				page={data.page}
				total={documents.pagination?.total ?? documents.data.length}
			/>
		{:else}
			<EmptyState
				icon={faFileLines}
				title="No bills found"
				message={data.q
					? `No bills in this Congress match "${data.q}".`
					: 'No bills are recorded for this Congress yet.'}
			/>
		{/if}
	{/await}
</div>
