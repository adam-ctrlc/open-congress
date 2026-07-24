<script lang="ts">
	import type { Snippet } from 'svelte';

	type Tone = 'primary' | 'secondary' | 'success' | 'neutral';

	let { tone = 'neutral', children }: { tone?: Tone; children: Snippet } = $props();

	const tones: Record<Tone, string> = {
		primary: 'bg-primary-50 text-primary-700 ring-primary-200',
		secondary: 'bg-secondary-50 text-secondary-700 ring-secondary-200',
		success: 'bg-success-50 text-success-700 ring-success-200',
		neutral: 'bg-gray-100 text-gray-600 ring-gray-200'
	};
</script>

<span
	class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-600 ring-1 ring-inset {tones[
		tone
	]}"
>
	{@render children()}
</span>
