<script lang="ts">
	import Fa from 'svelte-fa';
	import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

	type Tone = 'primary' | 'secondary' | 'success';

	let {
		icon,
		label,
		value,
		tone = 'primary'
	}: { icon: IconDefinition; label: string; value: string; tone?: Tone } = $props();

	const tones: Record<Tone, string> = {
		primary: 'bg-primary-50 text-primary-600 dark:text-primary-300',
		secondary: 'bg-secondary-50 text-secondary-600 dark:text-secondary-300',
		success: 'bg-success-50 text-success-600 dark:text-success-300'
	};
</script>

<div class="rounded-xl border border-gray-200 bg-surface p-5 shadow-sm">
	<div class="flex items-center gap-3">
		<span class="flex h-11 w-11 items-center justify-center rounded-lg {tones[tone]}">
			<Fa icon={icon} class="text-lg" />
		</span>
		<div>
			<div class="text-2xl font-800 text-gray-900">{value}</div>
			<div class="text-sm font-500 text-gray-500">{label}</div>
		</div>
	</div>
</div>
