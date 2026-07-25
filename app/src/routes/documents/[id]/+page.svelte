<script lang="ts">
	import Fa from 'svelte-fa';
	import Badge from '$lib/components/Badge.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import PersonCardSkeleton from '$lib/components/PersonCardSkeleton.svelte';
	import {
		faArrowLeftLong,
		faCalendarDays,
		faFileLines,
		faFilePdf,
		faHashtag,
		faLocationDot,
		faTag,
		faUsers,
		faBuildingColumns,
		faUpRightFromSquare
	} from '$lib/icons';
	import { formatDate, fullName } from '$lib/congress/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const doc = $derived(data.document);
	const heading = $derived(doc.title ?? doc.congress_website_title ?? doc.name);
	const chamberTone = $derived(doc.subtype === 'SB' ? 'primary' : 'secondary');
	const chamber = $derived(
		doc.subtype === 'SB' ? 'Senate' : doc.subtype === 'HB' ? 'House of Representatives' : doc.type
	);
</script>

<svelte:head>
	<title>{doc.name} | Open Congress</title>
</svelte:head>

<div class="border-b border-gray-200 bg-surface">
	<div class="mx-auto max-w-5xl px-4 py-10">
		<a
			href="/documents"
			class="mb-6 inline-flex items-center gap-2 text-sm font-600 text-gray-500 hover:text-primary-700 dark:hover:text-primary-200"
		>
			<Fa icon={faArrowLeftLong} /> All bills
		</a>
		<div class="mb-3 flex flex-wrap items-center gap-1.5">
			<Badge tone={chamberTone}>{doc.name}</Badge>
			{#if doc.congress != null}
				<Badge tone="neutral">{doc.congress}th Congress</Badge>
			{/if}
			{#if doc.type}
				<Badge tone="neutral">{doc.type}</Badge>
			{/if}
		</div>
		<h1 class="text-2xl font-800 text-gray-900 sm:text-3xl">{heading}</h1>
	</div>
</div>

<div class="mx-auto max-w-5xl px-4 py-10">
	<div class="grid gap-8 lg:grid-cols-3">
		<div class="lg:col-span-2">
			<section class="mb-8">
				<h2 class="mb-2 text-lg font-700 text-gray-900">Long title</h2>
				{#if doc.long_title}
					<p class="leading-relaxed text-gray-700">{doc.long_title}</p>
				{:else}
					<EmptyState
						icon={faFileLines}
						title="No long title"
						message="This bill has no long title recorded in the dataset."
					/>
				{/if}
			</section>

			{#if doc.congress_website_abstract}
				<section class="mb-8">
					<h2 class="mb-2 text-lg font-700 text-gray-900">Abstract</h2>
					<p class="leading-relaxed text-gray-700">{doc.congress_website_abstract}</p>
				</section>
			{/if}

			<section class="mb-8">
				<h2 class="mb-3 flex items-center gap-2 text-lg font-700 text-gray-900">
					<Fa icon={faUsers} class="text-primary-600 dark:text-primary-300" /> Authors
				</h2>
				{#await data.authors}
					<div class="grid gap-3 sm:grid-cols-2">
						{#each Array(4) as _, i (i)}
							<PersonCardSkeleton />
						{/each}
					</div>
				{:then authors}
					{#if authors.length > 0}
						<div class="flex flex-wrap gap-2">
							{#each authors as author (author.id)}
								<a
									href="/people/{author.id}"
									class="rounded-full border border-gray-200 bg-surface px-3 py-1.5 text-sm font-600 text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
								>
									{fullName(author)}
								</a>
							{/each}
						</div>
					{:else if doc.authors_raw}
						<p class="text-sm text-gray-600">{doc.authors_raw}</p>
					{:else}
						<EmptyState
							icon={faUsers}
							title="No author records"
							message="This bill has no linked authors in the dataset yet."
						/>
					{/if}
				{/await}
			</section>

			<section>
				<h2 class="mb-3 flex items-center gap-2 text-lg font-700 text-gray-900">
					<Fa icon={faTag} class="text-primary-600 dark:text-primary-300" /> Subjects
				</h2>
				{#if doc.subjects.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each doc.subjects as subject (subject)}
							<Badge tone="neutral">{subject}</Badge>
						{/each}
					</div>
				{:else}
					<EmptyState
						icon={faTag}
						title="No subjects"
						message="No subject tags are recorded for this bill."
					/>
				{/if}
			</section>
		</div>

		<aside class="lg:sticky lg:top-24 lg:col-span-1 lg:self-start">
			<div class="rounded-xl border border-gray-200 bg-surface p-5">
				<h2 class="mb-4 text-sm font-700 uppercase tracking-wide text-gray-500">Bill details</h2>
				<dl class="space-y-4">
					<div class="flex items-start gap-3">
						<Fa icon={faBuildingColumns} class="mt-0.5 text-gray-400" />
						<div>
							<dt class="text-xs text-gray-500">Chamber</dt>
							<dd class="font-600 text-gray-900">{chamber}</dd>
						</div>
					</div>
					<div class="flex items-start gap-3">
						<Fa icon={faCalendarDays} class="mt-0.5 text-gray-400" />
						<div>
							<dt class="text-xs text-gray-500">Date filed</dt>
							<dd class="font-600 text-gray-900">{formatDate(doc.date_filed)}</dd>
						</div>
					</div>
					{#if doc.scope}
						<div class="flex items-start gap-3">
							<Fa icon={faLocationDot} class="mt-0.5 text-gray-400" />
							<div>
								<dt class="text-xs text-gray-500">Scope</dt>
								<dd class="font-600 text-gray-900">{doc.scope}</dd>
							</div>
						</div>
					{/if}
					{#if doc.bill_number != null}
						<div class="flex items-start gap-3">
							<Fa icon={faHashtag} class="mt-0.5 text-gray-400" />
							<div>
								<dt class="text-xs text-gray-500">Bill number</dt>
								<dd class="font-600 text-gray-900">{doc.bill_number}</dd>
							</div>
						</div>
					{/if}
				</dl>

				{#if doc.download_url_sources && doc.download_url_sources.length > 0}
					<div class="mt-5 border-t border-gray-100 pt-4">
						<h3 class="mb-2 text-xs font-700 uppercase tracking-wide text-gray-500">
							Source documents
						</h3>
						<div class="space-y-2">
							{#each doc.download_url_sources as source, i (source)}
								<a
									href={source}
									target="_blank"
									rel="noreferrer"
									class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-600 text-gray-700 transition-colors hover:border-primary-300 hover:text-primary-700 dark:hover:text-primary-200"
								>
									<Fa icon={faFilePdf} class="text-gray-400" />
									{doc.download_url_sources.length > 1 ? `Document ${i + 1}` : 'Download document'}
								</a>
							{/each}
						</div>
					</div>
				{/if}
				{#if doc.senate_website_permalink}
					<a
						href={doc.senate_website_permalink}
						target="_blank"
						rel="noreferrer"
						class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 font-600 text-white transition-colors hover:bg-primary-700"
					>
						Senate website <Fa icon={faUpRightFromSquare} class="text-sm" />
					</a>
				{/if}
			</div>
		</aside>
	</div>
</div>
