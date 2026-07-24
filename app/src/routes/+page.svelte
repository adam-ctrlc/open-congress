<script lang="ts">
	import Fa from 'svelte-fa';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import StatCard from '$lib/components/StatCard.svelte';
	import BillsByCongressChart from '$lib/components/BillsByCongressChart.svelte';
	import {
		faUserTie,
		faFileLines,
		faBuildingColumns,
		faScroll,
		faScaleBalanced,
		faArrowRight,
		faChartColumn
	} from '$lib/icons';
	import { formatNumber } from '$lib/congress/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const sections = [
		{
			href: '/people',
			icon: faUserTie,
			title: 'Legislators',
			desc: 'Profiles of senators and representatives, their chambers and authored bills.'
		},
		{
			href: '/documents',
			icon: faFileLines,
			title: 'Bills',
			desc: 'Search Senate and House bills across every Congress by keyword.'
		},
		{
			href: '/congresses',
			icon: faBuildingColumns,
			title: 'Congresses',
			desc: 'Every Congress of the Philippines with terms and legislative totals.'
		}
	];
</script>

<svelte:head>
	<title>Open Congress | Philippine Legislative Data</title>
	<meta
		name="description"
		content="Explore Philippine legislative data: bills, senators, and representatives across every Congress."
	/>
</svelte:head>

<section
	class="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800"
>
	<div class="absolute inset-0 opacity-10">
		<div class="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-secondary-500 blur-3xl"></div>
		<div class="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-success-500 blur-3xl"></div>
	</div>
	<div class="relative mx-auto max-w-4xl px-4 py-16 text-center sm:py-20">
		<span
			class="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-500 text-primary-50 ring-1 ring-inset ring-white/20"
		>
			<Fa icon={faScaleBalanced} /> Philippine Legislative Data
		</span>
		<h1 class="text-4xl font-800 tracking-tight text-white sm:text-5xl">
			Explore the work of Congress
		</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
			Search bills, senators, and representatives across every Congress of the Philippines: open,
			searchable, and free.
		</p>
		<div class="mx-auto mt-8 max-w-2xl">
			<SearchBar action="/search" placeholder="Search legislators or bills..." large />
		</div>
	</div>
</section>

<div class="mx-auto max-w-6xl px-4">
	{#if data.stats}
		<section class="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
			<StatCard
				icon={faFileLines}
				tone="primary"
				label="Total bills"
				value={formatNumber(data.stats.total_bills)}
			/>
			<StatCard
				icon={faScroll}
				tone="secondary"
				label="Senate bills"
				value={formatNumber(data.stats.total_senate_bills)}
			/>
			<StatCard
				icon={faUserTie}
				tone="success"
				label="Legislators"
				value={formatNumber(data.stats.total_people)}
			/>
			<StatCard
				icon={faBuildingColumns}
				tone="primary"
				label="Congresses"
				value={formatNumber(data.stats.total_congresses)}
			/>
		</section>
	{:else}
		<section
			class="mt-10 rounded-xl border border-secondary-200 bg-secondary-50 p-5 text-sm text-secondary-800"
		>
			Live statistics are unavailable. Make sure the API gateway is running on its configured port.
		</section>
	{/if}

	<section class="mt-16">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h2 class="text-2xl font-800 text-gray-900">Browse the data</h2>
			{#if data.stats && data.stats.bills_by_congress?.length}
				<a
					href="#charts"
					class="inline-flex items-center gap-2 text-sm font-600 text-primary-600 hover:text-primary-700"
				>
					<Fa icon={faChartColumn} />
					See the charts
				</a>
			{/if}
		</div>
		<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each sections as section (section.href)}
				<a
					href={section.href}
					class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
				>
					<span
						class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600"
					>
						<Fa icon={section.icon} class="text-xl" />
					</span>
					<h3 class="mt-4 text-lg font-700 text-gray-900 group-hover:text-primary-700">
						{section.title}
					</h3>
					<p class="mt-1 text-sm text-gray-500">{section.desc}</p>
					<span class="mt-4 inline-flex items-center gap-2 text-sm font-600 text-primary-600">
						Explore
						<Fa icon={faArrowRight} class="transition-transform group-hover:translate-x-1" />
					</span>
				</a>
			{/each}
		</div>
	</section>

	{#if data.stats && data.stats.bills_by_congress?.length}
		<section id="charts" class="mt-16 scroll-mt-24">
			<h2 class="mb-6 text-2xl font-800 text-gray-900">Charts</h2>
			<BillsByCongressChart rows={data.stats.bills_by_congress} />
		</section>
	{/if}
</div>
