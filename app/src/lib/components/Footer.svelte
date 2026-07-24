<script lang="ts">
	import Fa from 'svelte-fa';
	import Logo from '$lib/components/Logo.svelte';
	import { faUpRightFromSquare } from '$lib/icons';
</script>

<footer class="mt-20 border-t border-gray-200 bg-white">
	<div class="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
		<div class="space-y-3">
			<Logo />
			<p class="text-sm text-gray-500">
				An explorer for Philippine legislative data: bills, senators, and representatives across
				every Congress.
			</p>
		</div>
		<div>
			<h3 class="mb-3 text-sm font-700 text-gray-900">Explore</h3>
			<ul class="space-y-2 text-sm text-gray-600">
				<li><a class="hover:text-primary-700" href="/people">Legislators</a></li>
				<li><a class="hover:text-primary-700" href="/documents">Bills</a></li>
				<li><a class="hover:text-primary-700" href="/congresses">Congresses</a></li>
			</ul>
		</div>
		<div>
			<h3 class="mb-3 text-sm font-700 text-gray-900">Data source</h3>
			<ul class="space-y-2 text-sm text-gray-600">
				<li>
					<a
						class="inline-flex items-center gap-1.5 hover:text-primary-700"
						href="https://open-congress-api.bettergov.ph"
						target="_blank"
						rel="noreferrer"
						>Open Congress API <Fa icon={faUpRightFromSquare} class="text-[0.6rem]" /></a
					>
				</li>
				<li>
					<a
						class="inline-flex items-center gap-1.5 hover:text-primary-700"
						href="https://bettergov.ph"
						target="_blank"
						rel="noreferrer">BetterGov.ph <Fa icon={faUpRightFromSquare} class="text-[0.6rem]" /></a
					>
				</li>
			</ul>
		</div>
		<div>
			<h3 class="mb-3 text-sm font-700 text-gray-900">About</h3>
			<p class="text-sm text-gray-500">
				Independent, non-official project. Data is public domain unless otherwise noted by the
				source.
			</p>
		</div>
	</div>
</footer>
