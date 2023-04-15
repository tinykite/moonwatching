<script lang="ts">
	export let handleToggle: () => void;
</script>

<button class="dateToggle" on:click={() => handleToggle()}>
	<p class="dateToggle__text">Choose a different date</p>
	<svg class={'dateToggle__icon'} viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M0.973527 4L9.29718 4M9.29718 4L5.65558 1M9.29718 4L5.65558 7"
			stroke="#B6CFFF"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</button>

<style>
	.dateToggle {
		display: flex;
		justify-content: center;
		align-items: baseline;
		background: none;
		border: none;
		cursor: pointer;
		font-family: 'Vulf Mono', 'Nimbus Mono PS', 'Courier New', 'Cutive Mono', monospace;
		font-style: italic;
		font-size: 0.875rem;
		color: #b6cfff;
		margin: 0 auto;
		opacity: 0;
		animation-name: fadeIn;
		animation-duration: 3s;
		animation-fill-mode: forwards;
	}

	.dateToggle__icon {
		width: 0.625rem;
		height: 0.5rem;
		display: inline;
		transition: transform 0.3s ease-in-out;
		animation-duration: 0.75s;
		animation-name: nudge;
		animation-delay: 3s;
	}

	.dateToggle__text {
		margin-right: 0.5rem;
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}

		100% {
			opacity: 1;
		}
	}

	@keyframes nudge {
		0% {
			transform: translateX(0);
		}

		50% {
			transform: translateX(5px);
		}

		100% {
			transform: translateX(0);
		}
	}
</style>
