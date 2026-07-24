<script lang="ts">
	import Fa from 'svelte-fa';
	import { faLandmark } from '$lib/icons';

	let { subtle = false }: { subtle?: boolean } = $props();
</script>

<a href="/" class="flex items-center gap-3">
	<span
		class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600 text-white shadow-sm"
	>
		<Fa icon={faLandmark} class="text-lg" />
	</span>
	<span class="leading-tight">
		<span class="block text-base font-700 {subtle ? 'text-white' : 'text-gray-900'}">
			Open Congress
		</span>
		<span class="block text-xs font-500 {subtle ? 'text-primary-100' : 'text-gray-500'}">
			Republic of the Philippines
		</span>
	</span>
</a>
