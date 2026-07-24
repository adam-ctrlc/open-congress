<script lang="ts">
	import Fa from 'svelte-fa';
	import { faLandmark } from '$lib/icons';

	let { subtle = false, compact = false }: { subtle?: boolean; compact?: boolean } = $props();
</script>

<a href="/" class="flex items-center gap-2 sm:gap-3">
	<span
		class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm sm:h-10 sm:w-10"
	>
		<Fa icon={faLandmark} class="text-base sm:text-lg" />
	</span>
	<span class="leading-tight">
		<span
			class="block text-sm font-700 sm:text-base {subtle ? 'text-white' : 'text-gray-900'}"
		>
			Open Congress
		</span>
		<span
			class="{compact ? 'hidden sm:block' : 'block'} text-xs font-500 {subtle
				? 'text-primary-100'
				: 'text-gray-500'}"
		>
			Republic of the Philippines
		</span>
	</span>
</a>
