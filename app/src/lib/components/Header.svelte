<script lang="ts">
	import Fa from 'svelte-fa';
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import SearchDialog from '$lib/components/SearchDialog.svelte';
	import {
		faUserTie,
		faFileLines,
		faBuildingColumns,
		faLandmark,
		faMagnifyingGlass
	} from '$lib/icons';

	const links = [
		{ href: '/senators', label: 'Senators', icon: faLandmark },
		{ href: '/people', label: 'Legislators', icon: faUserTie },
		{ href: '/documents', label: 'Bills', icon: faFileLines },
		{ href: '/congresses', label: 'Congresses', icon: faBuildingColumns }
	];

	let searchOpen = $state(false);
	let isMac = $state(false);

	$effect(() => {
		isMac = /mac/i.test(navigator.platform ?? navigator.userAgent);
	});

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<div class="h-1 w-full bg-gradient-to-r from-primary-600 via-secondary-500 to-success-500"></div>
<header class="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
	<div class="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:gap-4">
		<div class="shrink-0"><Logo /></div>

		<button
			type="button"
			onclick={() => (searchOpen = true)}
			class="mx-auto hidden w-full max-w-md flex-1 cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-2 text-left text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-white md:flex"
		>
			<Fa icon={faMagnifyingGlass} class="text-sm" />
			<span class="flex-1">Search legislators or bills...</span>
			<kbd class="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-xs font-600 text-gray-400">
				{isMac ? '⌘' : 'Ctrl'} K
			</kbd>
		</button>

		<nav class="flex shrink-0 items-center gap-0.5 sm:gap-1 md:ml-0">
			<button
				type="button"
				onclick={() => (searchOpen = true)}
				aria-label="Search"
				class="flex cursor-pointer items-center rounded-md px-2.5 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
			>
				<Fa icon={faMagnifyingGlass} class="text-sm" />
			</button>
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-600 transition-colors sm:px-3 {isActive(
						link.href
					)
						? 'bg-primary-50 text-primary-700'
						: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
				>
					<Fa icon={link.icon} class="text-xs opacity-80" />
					<span class="hidden lg:inline">{link.label}</span>
				</a>
			{/each}
		</nav>
	</div>
</header>

<SearchDialog bind:open={searchOpen} />
