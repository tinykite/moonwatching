<script lang="ts">
	import DateToggle from './DateToggle.svelte';
	interface Props {
		currentDate: string;
		handleToggle: () => void;
	}

	let { currentDate, handleToggle }: Props = $props();
</script>

<div class="currentDateContainer">
	<p class="date">
		{currentDate}
	</p>

	<DateToggle {handleToggle} />
</div>

<style>
	.currentDateContainer {
		grid-row: 1;
		grid-column: 1 / 1;
	}
	.date {
		font-family: 'Vulf Mono', 'Nimbus Mono PS', 'Courier New', 'Cutive Mono', monospace;
		font-size: 1.25rem;
		font-weight: 700;
		color: #e4edff;
		opacity: 0;
		transition: opacity 0.3s ease-in-out;
		animation-name: fadeIn;
		animation-duration: 3s;
		animation-fill-mode: forwards;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}
</style>
