<script lang="ts">
	import { navigating } from '$app/state';
</script>

{#if navigating.to}
	<div class="fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-primary-100">
		<div class="progress-indeterminate h-full w-1/4 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
	</div>
{/if}
