<script lang="ts">
	import { spline } from '$lib/spline';
	import { interpolate } from '$lib/math-utils';
	import { onMount } from 'svelte';

	let min = 0;
	let max = 360;

	let value: number = 0;
	let moonIllustrations: SVGSVGElement;
	let moonContainer: HTMLElement;
	let blobContainer: SVGGElement;
	let eclipticDomain = [0, 180];
	let rotateValue = 0;
	let scaleValue = 0;
	let scaleRange = [0, 20];
	let translateXValue = 0;

	$: if (value > 180) {
		eclipticDomain = [181, 360];
		scaleRange = [105, 100];
	}

	$: if (value <= 180) {
		eclipticDomain = [0, 180];
		scaleRange = [100, 105];
	}

	$: rotateValue = interpolate({
		domain: [0, 360],
		range: [0, 15],
		value
	});

	$: translateXValue = interpolate({
		domain: [0, 360],
		range: [0, -20],
		value
	});

	$: scaleValue = interpolate({
		domain: eclipticDomain,
		range: scaleRange,
		value
	});

	const random = (min: number, max: number, float = false) => {
		const val = Math.random() * (max - min) + min;

		if (float) {
			return val;
		}

		return Math.floor(val);
	};

	const blobs = {
		top: '',
		topAccent: '',
		middle: '',
		middleAccent: '',
		bottom: '',
		bottomAccent: ''
	};

	onMount(() => {
		const generateBlob = ({
			initialX,
			initialY,
			size,
			pullRange
		}: {
			initialX: number;
			initialY: number;
			size: [number, number];
			pullRange: [number, number];
		}) => {
			// choose a number of points
			const numPoints = random(15, 20);
			// step used to place each point at equal distances
			const angleStep = (Math.PI * 2) / numPoints;

			// keep track of your points
			const points = [];
			const [pullMin, pullMax] = pullRange;
			const [xSize, ySize] = size;

			for (let i = 1; i <= numPoints; i++) {
				// how much randomness should be added to each point
				const pull = random(pullMin, pullMax, true);

				// x & y coordinates of the current point
				const x = initialX + Math.cos(i * angleStep) * (xSize * pull);
				const y = initialY + Math.sin(i * angleStep) * (ySize * pull);

				// push the point to the points array
				points.push({ x, y });
			}

			// generate a smooth continuous curve based on the point:
			return spline(points, 1, true);
		};

		blobs.top = generateBlob({
			initialX: 170,
			initialY: 30,
			size: [140, 70],
			pullRange: [0.4, 0.7]
		});
		blobs.topAccent = generateBlob({
			initialX: 270,
			initialY: 30,
			size: [190, 20],
			pullRange: [0.5, 0.9]
		});
		blobs.middle = generateBlob({
			initialX: 50,
			initialY: 120,
			size: [180, 70],
			pullRange: [0.5, 0.7]
		});
		blobs.middleAccent = generateBlob({
			initialX: 25,
			initialY: 115,
			size: [90, 20],
			pullRange: [0.5, 0.9]
		});
		blobs.bottom = generateBlob({
			initialX: 140,
			initialY: 160,
			size: [140, 70],
			pullRange: [0.3, 0.6]
		});
		blobs.bottomAccent = generateBlob({
			initialX: 215,
			initialY: 170,
			size: [100, 25],
			pullRange: [0.5, 0.9]
		});
	});

	$: if (blobContainer) {
		blobContainer.style.transform = `rotate(${rotateValue}deg) translateX(${translateXValue}%)`;
		moonIllustrations.style.transform = `scale(${scaleValue}%)`;
	}
</script>

<h1 hidden>Lunar Cycle Visualization</h1>
<main class="moonVisContainer">
	<div class="moonContainer" bind:this={moonContainer}>
		<svg bind:this={moonIllustrations} viewBox="0 0 200 200" class="moon" style="filter:url(#glow)">
			<defs>
				<clipPath id="moonClip">
					<circle cx="100" cy="100" r="100" />
				</clipPath>

				<filter id="glow">
					<feGaussianBlur stdDeviation="20" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			<!-- <rect height="200" width="400" stroke="#FFF" fill="none" /> -->

			<circle fill="#FFFFFF" r="100" cy="100" cx="100" />
			<g clip-path="url(#moonClip)">
				<g class="blobs" bind:this={blobContainer}>
					<path class="blob" d={blobs.middle} fill="#B3B3B3" />
					<path class="blob" d={blobs.bottom} fill="#E6E6E6" />
					<path class="blob" d={blobs.top} fill="rgba(0, 0, 0, 0.5)" />
					<path class="blob" d={blobs.middleAccent} fill="#E6E6E6" />
					<path class="blob" d={blobs.topAccent} fill="#E6E6E6" />
					<path class="blob" d={blobs.bottomAccent} fill="#B3B3B3" />
				</g>
			</g>
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
	.moon {
		max-height: 50vh;
	}

	.blobs {
		opacity: 0.5;
		transition: all 0.2 ease-in;
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
