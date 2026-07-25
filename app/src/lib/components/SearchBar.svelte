<script lang="ts">
	import Fa from 'svelte-fa';
	import { faMagnifyingGlass } from '$lib/icons';

	let {
		action,
		value = '',
		placeholder = 'Search...',
		large = false
	}: { action: string; value?: string; placeholder?: string; large?: boolean } = $props();
</script>

<form method="GET" {action} role="search" class="relative w-full">
	<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
		<Fa icon={faMagnifyingGlass} />
	</span>
	<input
		type="search"
		name="q"
		{value}
		{placeholder}
		autocomplete="off"
		class="w-full rounded-xl border-gray-200 bg-surface pl-11 pr-28 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500 {large
			? 'py-4 text-lg'
			: 'py-2.5'}"
	/>
	<button
		type="submit"
		class="absolute inset-y-0 right-0 my-1.5 mr-1.5 cursor-pointer rounded-lg bg-primary-600 px-4 font-600 text-white transition-colors hover:bg-primary-700"
	>
		Search
	</button>
</form>
