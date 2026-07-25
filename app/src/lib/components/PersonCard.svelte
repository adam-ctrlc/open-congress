<script lang="ts">
	import Fa from 'svelte-fa';
	import Badge from '$lib/components/Badge.svelte';
	import { faChevronRight } from '$lib/icons';
	import { fullName, initials } from '$lib/congress/format';
	import type { Person } from '$lib/congress/types';

	let { person }: { person: Person } = $props();

	const isSenator = $derived((person.senate_website_keys?.length ?? 0) > 0);
</script>

<a
	href="/people/{person.id}"
	class="group flex min-w-0 items-center gap-4 rounded-xl border border-gray-200 bg-surface p-4 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
>
	<span
		class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-700 text-primary-700 dark:text-primary-300"
	>
		{initials(person)}
	</span>
	<div class="min-w-0 flex-1">
		<div class="truncate font-700 text-gray-900 group-hover:text-primary-700 dark:group-hover:text-primary-200">
			{fullName(person)}
		</div>
		<div class="mt-1 flex flex-wrap gap-1.5">
			{#if isSenator}
				<Badge tone="primary">Senate</Badge>
			{/if}
			{#if person.aliases && person.aliases.length > 0}
				<Badge tone="neutral">"{person.aliases[0]}"</Badge>
			{/if}
		</div>
	</div>
	<Fa
		icon={faChevronRight}
		class="shrink-0 text-gray-300 transition-colors group-hover:text-primary-500"
	/>
</a>
