<script lang="ts">
	import Fa from 'svelte-fa';
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
	import { faFolderOpen } from '$lib/icons';

	let {
		title,
		message,
		icon = faFolderOpen,
		compact = false
	}: { title: string; message: string; icon?: IconDefinition; compact?: boolean } = $props();
</script>

<div
	class="rounded-xl border border-dashed border-gray-300 bg-white text-center {compact
		? 'p-6'
		: 'p-12'}"
>
	<div
		class="mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 text-gray-300 {compact
			? 'h-14 w-14'
			: 'h-20 w-20'}"
	>
		<Fa icon={icon} class={compact ? 'text-2xl' : 'text-4xl'} />
	</div>
	<h3 class="font-700 text-gray-900">{title}</h3>
	<p class="mx-auto mt-1 max-w-sm text-sm text-gray-500">{message}</p>
</div>
