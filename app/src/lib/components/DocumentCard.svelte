<script lang="ts">
	import Fa from 'svelte-fa';
	import Badge from '$lib/components/Badge.svelte';
	import { faCalendarDays, faLocationDot } from '$lib/icons';
	import { formatDate } from '$lib/congress/format';
	import type { DocumentSummary } from '$lib/congress/types';

	let { document }: { document: DocumentSummary } = $props();

	const heading = $derived(document.title ?? document.congress_website_title ?? document.name);
	const chamberTone = $derived(document.subtype === 'SB' ? 'primary' : 'secondary');
</script>

<a
	href="/documents/{document.id}"
	class="group block min-w-0 rounded-xl border border-gray-200 bg-surface p-5 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
>
	<div class="mb-2 flex flex-wrap items-center gap-1.5">
		<Badge tone={chamberTone}>{document.name}</Badge>
		{#if document.congress != null}
			<Badge tone="neutral">{document.congress}th Congress</Badge>
		{/if}
	</div>
	<h3 class="line-clamp-2 font-700 text-gray-900 group-hover:text-primary-700 dark:group-hover:text-primary-200">
		{heading}
	</h3>
	{#if document.long_title}
		<p class="mt-1 line-clamp-2 text-sm text-gray-500">{document.long_title}</p>
	{/if}
	<div class="mt-3 flex flex-wrap gap-4 text-xs font-500 text-gray-500">
		<span class="inline-flex items-center gap-1.5">
			<Fa icon={faCalendarDays} />
			{formatDate(document.date_filed)}
		</span>
		{#if document.scope}
			<span class="inline-flex items-center gap-1.5">
				<Fa icon={faLocationDot} />
				{document.scope}
			</span>
		{/if}
	</div>
</a>
