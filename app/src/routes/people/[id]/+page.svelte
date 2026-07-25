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
		faFileLines,
		faLayerGroup,
		faUpRightFromSquare
	} from '$lib/icons';
	import { chamberLabel, formatNumber, fullName, initials } from '$lib/congress/format';
	import { documentSorts } from '$lib/congress/sort';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const person = $derived(data.person);
	const senateLink = $derived(
		person.senate_website_keys?.length
			? `https://web.senate.gov.ph/senators/sen_bio/${person.senate_website_keys[0]}.asp`
			: null
	);

	const chambers = $derived([...new Set(data.groups.map((group) => chamberLabel(group)))]);
	const congressNumbers = $derived(
		[...new Set(data.groups.map((group) => group.congress).filter((n): n is number => n != null))].sort(
			(a, b) => a - b
		)
	);
	const congressRange = $derived(
		congressNumbers.length === 0
			? null
			: congressNumbers.length === 1
				? `${congressNumbers[0]}th`
				: `${congressNumbers[0]}th to ${congressNumbers[congressNumbers.length - 1]}th`
	);
</script>

<svelte:head>
	<title>{fullName(person)} | Open Congress</title>
</svelte:head>

<div class="border-b border-gray-200 bg-surface">
	<div class="mx-auto max-w-5xl px-4 py-10">
		<a
			href="/people"
			class="mb-6 inline-flex items-center gap-2 text-sm font-600 text-gray-500 hover:text-primary-700 dark:hover:text-primary-200"
		>
			<Fa icon={faArrowLeftLong} /> All legislators
		</a>
		<div class="flex flex-col gap-5 sm:flex-row sm:items-center">
			<span
				class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-2xl font-800 text-primary-700 dark:text-primary-300"
			>
				{initials(person)}
			</span>
			<div>
				<h1 class="text-2xl font-800 text-gray-900 sm:text-3xl">{fullName(person)}</h1>
				<div class="mt-2 flex flex-wrap gap-1.5">
					{#if person.senate_website_keys?.length}
						<Badge tone="primary">Senator</Badge>
					{/if}
					{#each person.aliases ?? [] as alias (alias)}
						<Badge tone="neutral">"{alias}"</Badge>
					{/each}
					{#each person.professional_designations ?? [] as designation (designation)}
						<Badge tone="success">{designation}</Badge>
					{/each}
				</div>
				{#if senateLink}
					<a
						href={senateLink}
						target="_blank"
						rel="noreferrer"
						class="mt-3 inline-flex items-center gap-1.5 text-sm font-600 text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
					>
						Senate profile <Fa icon={faUpRightFromSquare} class="text-xs" />
					</a>
				{/if}
			</div>
		</div>
	</div>
</div>

<div class="mx-auto max-w-5xl px-4 py-10">
	<div class="grid gap-8 lg:grid-cols-3">
		<aside class="space-y-6 lg:sticky lg:top-24 lg:col-span-1 lg:self-start">
			<section>
				<h2 class="mb-3 flex items-center gap-2 text-lg font-700 text-gray-900">
					<Fa icon={faLayerGroup} class="text-primary-600 dark:text-primary-300" /> Service
				</h2>
				<dl class="space-y-3 rounded-xl border border-gray-200 bg-surface p-4">
					<div class="flex flex-col gap-0.5">
						<dt class="text-sm text-gray-500">Chambers</dt>
						<dd class="text-sm font-600 text-gray-900">
							{chambers.length ? chambers.join(', ') : 'Not recorded'}
						</dd>
					</div>
					<div class="flex items-center justify-between gap-4">
						<dt class="text-sm text-gray-500">Congresses served</dt>
						<dd class="text-sm font-600 text-gray-900">{congressNumbers.length}</dd>
					</div>
					{#if congressRange}
						<div class="flex items-center justify-between gap-4">
							<dt class="text-sm text-gray-500">Span</dt>
							<dd class="text-sm font-600 text-gray-900">{congressRange}</dd>
						</div>
					{/if}
				</dl>
			</section>

			<section>
				<h2 class="mb-3 flex items-center gap-2 text-lg font-700 text-gray-900">
					<Fa icon={faBuildingColumns} class="text-primary-600 dark:text-primary-300" /> Memberships
				</h2>
				{#if data.groups.length > 0}
					<ul class="space-y-2">
						{#each data.groups as group (group.id)}
							<li class="rounded-lg border border-gray-200 bg-surface p-3">
								<div class="font-600 text-gray-900">{chamberLabel(group)}</div>
								<div class="text-sm text-gray-500">{group.name}</div>
							</li>
						{/each}
					</ul>
				{:else}
					<EmptyState
						compact
						icon={faBuildingColumns}
						title="No memberships"
						message="No chamber membership records found."
					/>
				{/if}
			</section>
		</aside>

		<section class="lg:col-span-2">
			<h2 class="mb-4 flex items-center gap-2 text-lg font-700 text-gray-900">
				<Fa icon={faFileLines} class="text-primary-600 dark:text-primary-300" /> Authored bills
			</h2>
			<div class="mb-4">
				<Toolbar
					action="/people/{person.id}"
					q={data.q}
					searchPlaceholder="Search this legislator's bills..."
					sort={data.sort}
					sortOptions={documentSorts}
				/>
			</div>

			{#await data.documents}
				<div class="grid gap-4">
					{#each Array(4) as _, i (i)}
						<DocumentCardSkeleton />
					{/each}
				</div>
			{:then documents}
				{#if documents.data.length > 0}
					<p class="mb-3 text-sm text-gray-500">
						{formatNumber(documents.pagination?.total ?? documents.data.length)}
						{data.q ? `results for "${data.q}"` : 'bills on record'}
					</p>
					<div class="grid gap-4">
						{#each documents.data as document (document.id)}
							<DocumentCard {document} />
						{/each}
					</div>
					<Pagination
						basePath="/people/{person.id}"
						params={{ q: data.q, sort: data.sort }}
						limit={data.limit}
						page={data.page}
						total={documents.pagination?.total ?? documents.data.length}
					/>
				{:else}
					<EmptyState
						icon={faFileLines}
						title={data.q ? 'No matching bills' : 'No authored bills'}
						message={data.q
							? `None of this legislator's bills match "${data.q}". Try another keyword.`
							: 'No legislative authorship records found for this legislator.'}
					/>
				{/if}
			{/await}
		</section>
	</div>
</div>
