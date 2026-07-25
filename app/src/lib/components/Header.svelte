<script lang="ts">
	import Fa from 'svelte-fa';
	import { page } from '$app/state';
	import Logo from '$lib/components/Logo.svelte';
	import SearchDialog from '$lib/components/SearchDialog.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
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

<header class="sticky top-0 z-40 border-b border-gray-200 bg-surface/90 backdrop-blur">
	<div
		class="h-1.5 w-full bg-gradient-to-r from-primary-600 via-secondary-500 to-success-500 sm:h-1"
	></div>
	<div class="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3 sm:gap-4 sm:px-4">
		<div class="flex min-w-0 flex-1 justify-start"><Logo compact /></div>

		<button
			type="button"
			onclick={() => (searchOpen = true)}
			class="hidden w-full min-w-0 max-w-xs cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 py-2 pl-3 pr-2 text-left text-sm text-gray-400 transition-colors hover:border-gray-300 hover:bg-surface md:flex"
		>
			<Fa icon={faMagnifyingGlass} class="text-sm" />
			<span class="flex-1">Search legislators or bills...</span>
			<kbd class="rounded border border-gray-200 bg-surface px-1.5 py-0.5 text-xs font-600 text-gray-400">
				{isMac ? '⌘' : 'Ctrl'} K
			</kbd>
		</button>

		<nav class="flex flex-1 items-center justify-end gap-0 sm:gap-1">
			<button
				type="button"
				onclick={() => (searchOpen = true)}
				aria-label="Search"
				class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
			>
				<Fa icon={faMagnifyingGlass} class="text-sm" />
			</button>
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-label={link.label}
					title={link.label}
					class="flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-2 text-sm font-600 transition-colors sm:px-2.5 lg:px-3 {isActive(
						link.href
					)
						? 'bg-primary-50 text-primary-700 dark:text-primary-300'
						: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
				>
					<Fa icon={link.icon} class="text-sm lg:text-xs" />
					<span class="hidden lg:inline">{link.label}</span>
				</a>
			{/each}
			<span class="mx-1 hidden h-5 w-px bg-gray-200 sm:block"></span>
			<ThemeToggle />
		</nav>
	</div>
</header>

<SearchDialog bind:open={searchOpen} />
