<script lang="ts">
	import Fa from 'svelte-fa';
	import { goto } from '$app/navigation';
	import { faMagnifyingGlass, faUserTie, faFileLines, faArrowRight } from '$lib/icons';
	import { fullName } from '$lib/congress/format';
	import type { DocumentSummary, Person } from '$lib/congress/types';

	let { open = $bindable(false) }: { open?: boolean } = $props();

	interface Item {
		id: string;
		href: string;
		title: string;
		subtitle: string;
		group: 'Legislators' | 'Bills';
	}

	let dialog = $state<HTMLDialogElement | null>(null);
	let input = $state<HTMLInputElement | null>(null);
	let query = $state('');
	let items = $state<Item[]>([]);
	let peopleTotal = $state(0);
	let documentsTotal = $state(0);
	let loading = $state(false);
	let active = $state(0);

	let controller: AbortController | null = null;
	let timer: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (open) {
			dialog?.showModal();
			input?.focus();
		} else {
			dialog?.close();
		}
	});

	function reset(): void {
		query = '';
		items = [];
		peopleTotal = 0;
		documentsTotal = 0;
		active = 0;
		loading = false;
	}

	function close(): void {
		open = false;
		reset();
	}

	async function run(term: string): Promise<void> {
		controller?.abort();

		if (term.trim().length < 2) {
			items = [];
			peopleTotal = 0;
			documentsTotal = 0;
			loading = false;
			return;
		}

		controller = new AbortController();
		loading = true;

		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
				signal: controller.signal
			});
			const data = (await response.json()) as {
				people: Person[];
				documents: DocumentSummary[];
				peopleTotal: number;
				documentsTotal: number;
			};

			items = [
				...data.people.map((person) => ({
					id: person.id,
					href: `/people/${person.id}`,
					title: fullName(person),
					subtitle: person.senate_website_keys?.length ? 'Senator' : 'Legislator',
					group: 'Legislators' as const
				})),
				...data.documents.map((document) => ({
					id: document.id,
					href: `/documents/${document.id}`,
					title: document.title ?? document.congress_website_title ?? document.name,
					subtitle: `${document.name}${document.congress ? ` · ${document.congress}th Congress` : ''}`,
					group: 'Bills' as const
				}))
			];
			peopleTotal = data.peopleTotal;
			documentsTotal = data.documentsTotal;
			active = 0;
			loading = false;
		} catch (error) {
			if ((error as Error).name !== 'AbortError') {
				items = [];
				loading = false;
			}
		}
	}

	function onInput(event: Event): void {
		query = (event.currentTarget as HTMLInputElement).value;
		if (timer) clearTimeout(timer);
		const term = query;
		timer = setTimeout(() => run(term), 180);
	}

	function select(item: Item): void {
		close();
		goto(item.href);
	}

	function onKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				if (items.length > 0) active = (active + 1) % items.length;
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (items.length > 0) active = (active - 1 + items.length) % items.length;
				break;
			case 'Enter':
				event.preventDefault();
				if (items[active]) {
					select(items[active]);
				} else if (query.trim()) {
					close();
					goto(`/search?q=${encodeURIComponent(query)}`);
				}
				break;
		}
	}

	const groups = $derived([
		{ name: 'Legislators' as const, icon: faUserTie, total: peopleTotal, href: '/people' },
		{ name: 'Bills' as const, icon: faFileLines, total: documentsTotal, href: '/documents' }
	]);
</script>

<svelte:window
	onkeydown={(event) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			open = !open;
		}
	}}
/>

<dialog
	bind:this={dialog}
	onclose={close}
	onclick={(event) => {
		if (event.target === dialog) close();
	}}
	class="fixed left-1/2 top-[12vh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-0 shadow-2xl backdrop:bg-gray-900/40 backdrop:backdrop-blur-sm"
>
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div role="combobox" aria-expanded="true" aria-haspopup="listbox" aria-controls="search-results">
		<div class="flex items-center gap-3 border-b border-gray-100 px-4">
			<Fa icon={faMagnifyingGlass} class="text-gray-400" />
			<input
				bind:this={input}
				value={query}
				oninput={onInput}
				onkeydown={onKeydown}
				type="text"
				placeholder="Search legislators or bills..."
				aria-label="Search legislators or bills"
				autocomplete="off"
				class="w-full border-0 py-4 text-base text-gray-900 placeholder:text-gray-400 focus:ring-0"
			/>
			<kbd class="hidden shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-400 sm:block">
				Esc
			</kbd>
		</div>

		<div id="search-results" role="listbox" class="max-h-80 overflow-y-auto p-2">
			{#if loading && items.length === 0}
				<div class="space-y-2 p-2">
					{#each Array(4) as _, i (i)}
						<div class="h-11 animate-pulse rounded-lg bg-gray-100"></div>
					{/each}
				</div>
			{:else if query.trim().length < 2}
				<p class="p-6 text-center text-sm text-gray-400">
					Type at least 2 characters to search.
				</p>
			{:else if items.length === 0}
				<p class="p-6 text-center text-sm text-gray-500">
					No results for "{query}".
				</p>
			{:else}
				{#each groups as group (group.name)}
					{@const groupItems = items.filter((item) => item.group === group.name)}
					{#if groupItems.length > 0}
						<div class="mb-1 flex items-center justify-between px-2 pt-2">
							<span class="text-xs font-700 uppercase tracking-wide text-gray-400">
								{group.name}
							</span>
							{#if group.total > groupItems.length}
								<a
									href="{group.href}?q={encodeURIComponent(query)}"
									onclick={close}
									class="text-xs font-600 text-primary-600 hover:text-primary-700"
								>
									See all {group.total}
								</a>
							{/if}
						</div>
						{#each groupItems as item (item.id)}
							{@const index = items.indexOf(item)}
							<button
								type="button"
								role="option"
								aria-selected={index === active}
								onclick={() => select(item)}
								onmouseenter={() => (active = index)}
								class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors {index ===
								active
									? 'bg-primary-50'
									: 'hover:bg-gray-50'}"
							>
								<span
									class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {index === active
										? 'bg-primary-100 text-primary-600'
										: 'bg-gray-100 text-gray-400'}"
								>
									<Fa icon={group.icon} class="text-sm" />
								</span>
								<span class="min-w-0 flex-1">
									<span class="block truncate text-sm font-600 text-gray-900">{item.title}</span>
									<span class="block truncate text-xs text-gray-500">{item.subtitle}</span>
								</span>
								{#if index === active}
									<Fa icon={faArrowRight} class="shrink-0 text-xs text-primary-500" />
								{/if}
							</button>
						{/each}
					{/if}
				{/each}
			{/if}
		</div>

		<div
			class="flex items-center justify-between gap-4 border-t border-gray-100 px-4 py-2.5 text-xs text-gray-400"
		>
			<span class="flex items-center gap-3">
				<span class="flex items-center gap-1">
					<kbd class="rounded border border-gray-200 px-1.5 py-0.5">up</kbd>
					<kbd class="rounded border border-gray-200 px-1.5 py-0.5">down</kbd>
					to navigate
				</span>
				<span class="hidden items-center gap-1 sm:flex">
					<kbd class="rounded border border-gray-200 px-1.5 py-0.5">Enter</kbd>
					to open
				</span>
			</span>
			{#if query.trim()}
				<a
					href="/search?q={encodeURIComponent(query)}"
					onclick={close}
					class="font-600 text-primary-600 hover:text-primary-700"
				>
					All results
				</a>
			{/if}
		</div>
	</div>
</dialog>
