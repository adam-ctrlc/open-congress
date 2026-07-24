<script lang="ts">
	import { navigating } from '$app/state';
</script>

{#if navigating.to}
	<div class="pointer-events-none fixed inset-x-0 top-0 z-50 h-1.5 overflow-hidden sm:h-1">
		<div class="progress-indeterminate h-full w-1/3 bg-white/70"></div>
	</div>
{/if}
