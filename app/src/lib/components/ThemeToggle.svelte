<script lang="ts">
	import Fa from 'svelte-fa';
	import { faSun, faMoon, faDesktop } from '$lib/icons';
	import { apply, read, save, type Theme } from '$lib/theme';

	let theme = $state<Theme>('system');

	const options: { value: Theme; label: string; icon: typeof faSun }[] = [
		{ value: 'system', label: 'System theme', icon: faDesktop },
		{ value: 'light', label: 'Light theme', icon: faSun },
		{ value: 'dark', label: 'Dark theme', icon: faMoon }
	];

	const current = $derived(options.find((option) => option.value === theme) ?? options[0]);

	$effect(() => {
		theme = read();

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = () => {
			if (read() === 'system') apply('system');
		};
		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	});

	function cycle(): void {
		const next = options[(options.findIndex((o) => o.value === theme) + 1) % options.length].value;
		theme = next;
		save(next);
		apply(next);
	}
</script>

<button
	type="button"
	onclick={cycle}
	aria-label={current.label}
	title="{current.label} (click to change)"
	class="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
>
	<Fa icon={current.icon} class="text-sm" />
</button>
