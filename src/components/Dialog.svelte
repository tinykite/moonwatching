<script lang="ts">
	import { animate } from 'motion';
	export let title: string;
	export let success: string;

	let dialog: HTMLDialogElement;
	let isOpen = false;

	function closeDialog() {
		isOpen = false;
		animate(dialog, { opacity: 0 }, { duration: 0.5 });
	}

	function lightDismiss({ target }: { target: any }) {
		if (target.nodeName === 'DIALOG') {
			dialog.close('dismiss');
			isOpen = false;
		}
	}

	export function open() {
		dialog.showModal();
		isOpen = true;
		animate(dialog, { opacity: 1 }, { duration: 0.5 });
	}

	export async function close() {
		await animate(dialog, { opacity: 0 }, { duration: 0.5 }).finished;
		dialog.close('close');
	}

	$: if (success) {
		close();
	}
</script>

<dialog
	inert={isOpen ? undefined : true}
	aria-hidden={isOpen ? undefined : true}
	bind:this={dialog}
	on:close={closeDialog}
	on:click={lightDismiss}
	class="dialog"
>
	<div class="dialog__inner">
		<slot name="icon" />
		<h1>{title}</h1>

		<slot name="form" />
	</div>
</dialog>

<style>
	.dialog {
		display: grid;
		max-inline-size: min(90vw, 45rem);
		max-block-size: min(80vh, 100%);
		max-block-size: min(80dvb, 100%);
		margin: auto;
		padding: 1rem;
		position: fixed;
		inset: 0;
		background-color: #e4edff;
	}

	.dialog:not([open]) {
		pointer-events: none;
		opacity: 0;
	}

	@media screen and (min-width: 43.75rem) {
		.dialog {
			padding: 3rem 6rem;
		}
	}

	.dialog::backdrop {
		backdrop-filter: blur(1px);
	}

	.dialog__inner {
		width: 75%;
		display: grid;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
	}

	h1 {
		font-family: 'swear-text', serif;
		font-weight: 500;
		font-style: normal;
		font-size: 1.5rem;
		color: #000e24;
		text-align: center;
		line-height: 1.125;
		margin-top: 1rem;
	}
</style>
