<script lang="ts">
	import Nav from '../../components/Nav.svelte';
	import { spline } from '@georgedoescode/spline';
	import { SVG } from '@svgdotjs/svg.js';
	import { interpolate } from '$lib/math-utils';
	let min = 0;
	let max = 360;

	let value: number = 0;
	let moon: SVGSVGElement;
	let lerpValue = 0;
	let lerpDomain = [0, 180];
	let lerpRange = [0, 1];

	$: if (value > 180) {
		lerpDomain = [181, 360];
		lerpRange = [1, 0];
	}

	$: if (value <= 180) {
		lerpDomain = [0, 180];
		lerpRange = [0, 1];
	}

	$: lerpValue = interpolate({
		domain: lerpDomain,
		range: lerpRange,
		value
	});

	$: if (moon) moon.style.opacity = `${lerpValue}`;
</script>

<Nav />
<h1 hidden>Lunar Cycle Visualization</h1>
<main class="moonVisContainer">
	<div class="moonContainer">
		<svg viewBox="0 0 500 500" class="moon" bind:this={moon}>
			<defs>
				<linearGradient id="fade" x2="0%" y2="100%">
					<stop offset="0%" stop-color="#ffffff" />
					<stop offset="50%" stop-color="#b4b5b6" />
					<stop offset="99%" stop-color="transparent" />
				</linearGradient>

				<filter id="glow">
					<feGaussianBlur stdDeviation="5" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			<circle fill="url(#fade)" r="240" cy="250" cx="250" style="filter:url(#glow)" />
		</svg>

		<div class="flex moonLabel">
			<label for="ecliptic">Ecliptic Longitude</label>: {value}
		</div>
		<div class="rangeContainer">
			<p>{min}</p>
			<input bind:value type="range" id="ecliptic" name="ecliptic" {min} {max} />
			<p>{max}</p>
		</div>
	</div>
	<div class="moonVisDetail" hidden>
		<article>
			<p>Current Phase:</p>
			<h2>Waxing Crescent</h2>
			<details>
				<summary>Details</summary>
				<p>
					This is the invisible phase of the Moon, with the illuminated side of the Moon facing the
					Sun and the night side facing Earth. In this phase, the Moon is in the same part of the
					sky as the Sun and rises and sets with the Sun. Not only is the illuminated side facing
					away from the Earth, it’s also up during the day! Remember, in this phase, the Moon
					doesn’t usually pass directly between Earth and the Sun, due to the inclination of the
					Moon’s orbit. It only passes near the Sun from our perspective on Earth.
				</p>
			</details>
		</article>
	</div>
</main>

<style>
	.moonCircle {
		/* filter: linear-gradient(
			330deg,
			hsl(217deg 100% 7%) 1%,
			#b4b5b6 50%,
			transparent 99%
		); */
	}

	.moonLabel {
		margin-top: 2rem;
	}
	.moonVisContainer {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 2rem;
		margin: 2rem auto;
		align-items: center;
		max-width: 40rem;
	}
	.moonContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.moonVisDetail {
	}
	.moon {
		opacity: 0;
		max-width: 100%;
		transition: opacity 0.5 ease-in-out;
	}
	.rangeContainer {
		display: flex;
		margin-top: 1.5rem;
	}

	/* https://www.smashingmagazine.com/2021/12/create-custom-range-input-consistent-browsers/ */
	/* Reset default styles, which vary wildly between browsers */
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
		width: 15rem;
		margin: 0 1rem;
	}

	/* Removes default focus */
	input[type='range']:focus {
		outline: none;
	}

	/* Chrome, Safari, Opera and Edge Chromium styles */
	/* slider track */
	input[type='range']::-webkit-slider-runnable-track {
		background-color: #053a5f;
		border-radius: 0.5rem;
		height: 0.5rem;
	}

	/* slider thumb */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none; /* Override default look */
		appearance: none;
		margin-top: -12px; /* Centers thumb on the track */

		/*custom styles*/
		background-color: #5cd5eb;
		height: 2rem;
		width: 1rem;
	}

	input[type='range']:focus::-webkit-slider-thumb {
		border: 1px solid #053a5f;
		outline: 3px solid #053a5f;
		outline-offset: 0.125rem;
	}

	/* Firefox styles */
	/* slider track */
	input[type='range']::-moz-range-track {
		background-color: #053a5f;
		border-radius: 0.5rem;
		height: 0.5rem;
	}

	/* slider thumb */
	input[type='range']::-moz-range-thumb {
		border: none; /*Removes extra border that FF applies*/
		border-radius: 0; /*Removes default border-radius that FF applies*/

		/*custom styles*/
		background-color: #5cd5eb;
		height: 2rem;
		width: 1rem;
	}

	input[type='range']:focus::-moz-range-thumb {
		border: 1px solid #053a5f;
		outline: 3px solid #053a5f;
		outline-offset: 0.125rem;
	}
</style>
