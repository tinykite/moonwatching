<script lang="ts">
	import { spline } from '$lib/spline';
	import { interpolate } from '$lib/math-utils';
	import { onMount } from 'svelte';
	import * as flubber from 'flubber';
	import { getDate, format } from 'date-fns';
	import type { MoonPhase } from '$lib/moon-utils';

	export let data: PageData;
	let phasesByDate = data.moonPhases.reduce(
		(phases: Record<string, MoonPhase>, currentPhase: MoonPhase) => {
			const date = parseInt(currentPhase.date.split('-')[2]);
			return { ...phases, [date]: currentPhase };
		},
		{}
	);

	let dateMin = 1;
	let dateMax = data.moonPhases.length;

	const date = new Date();
	const currentDate = getDate(date);
	const currentMonth = format(date, 'MMMM');

	let min = 0;
	let max = 360;

	let chosenDate: number = currentDate;
	let chosenPhase: string = phasesByDate[chosenDate].phase;
	let value: number = phasesByDate[chosenDate].ecliptic_longitude;

	let moonPhaseMask: SVGPathElement;
	let moonIllustrations: SVGSVGElement;
	let moonContainer: HTMLElement;
	let blobContainer: SVGGElement;
	let eclipticDomain = [0, 180];
	let opacityRange = [0, 1];
	let rotateValue = 0;
	let scaleValue = 0;
	let scaleRange = [0, 20];
	let translateXValue = 0;
	let blobOpacityValue = 0;

	$: if (value > 180) {
		eclipticDomain = [181, 360];
		scaleRange = [105, 100];
		opacityRange = [1, 0];
	}

	$: if (value <= 180) {
		eclipticDomain = [0, 180];
		scaleRange = [100, 105];
		opacityRange = [0, 1];
	}

	$: rotateValue = interpolate({
		domain: [0, 360],
		range: [0, 5],
		value
	});

	$: translateXValue = interpolate({
		domain: [0, 360],
		range: [0, -20],
		value
	});

	const paths = {
		newMoonA: 'M0,0 L0,201',
		newMoonB: 'M201,0 L201, 201',
		waxingCrescent:
			'M80.849 3.5272C50.855 16.483 10.9711 52.0284 11.4579 100.965C11.9191 146.315 46.9093 188.701 96.9563 200C42.1352 197.13 -0.541396 151.371 0.00519188 98.6677C0.534699 49.0904 39.1802 5.97831 90.3716 0C88.0059 0.734478 84.6922 1.87036 80.849 3.5272Z',
		firstQuarter:
			'M102 0.0195925C101.335 0.00653088 100.668 5.84175e-08 100 0C44.7715 -4.82823e-06 4.82823e-06 44.7715 0 100C-4.82822e-06 155.228 44.7715 200 100 200C100.668 200 101.335 199.993 102 199.98L102 0.0195925Z',
		fullMoon:
			'M200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0C155.228 0 200 44.7715 200 100Z',
		lastQuarter:
			'M99 201C154.505 201 199.5 156.005 199.5 100.5C199.5 44.9954 154.505 4.85237e-06 99 0L99 201Z',
		waningCrescent:
			'M116.115 3.5272C146.122 16.483 186.024 52.0284 185.537 100.965C185.076 146.315 150.07 188.701 100 200C154.846 197.13 197.542 151.371 196.995 98.6677C196.465 49.0904 157.802 5.97831 106.588 0C108.954 0.734478 112.27 1.87036 116.115 3.5272Z'
	};

	let flubberInterpolate = flubber.interpolate ?? flubber.default.interpolate;

	$: scaleValue = interpolate({
		domain: eclipticDomain,
		range: scaleRange,
		value
	});

	$: blobOpacityValue = interpolate({
		domain: [0, 360],
		range: opacityRange,
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
		bottomAccent: '',
		middleTertiary: ''
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
		blobs.middleTertiary = generateBlob({
			initialX: 0,
			initialY: 115,
			size: [90, 8],
			pullRange: [0.6, 0.7]
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

	let newMoonToWaxingCrescent = flubberInterpolate(paths.newMoonA, paths.waxingCrescent);
	let waxingCrescentToFirstQuarter = flubberInterpolate(paths.waxingCrescent, paths.firstQuarter);
	let firstQuarterToFullMoon = flubberInterpolate(paths.firstQuarter, paths.fullMoon);
	let fullMoonToLastQuarter = flubberInterpolate(paths.fullMoon, paths.lastQuarter);
	let lastQuarterToWaningCrescent = flubberInterpolate(paths.lastQuarter, paths.waningCrescent);
	let waningCrescentToNewMoon = flubberInterpolate(paths.waningCrescent, paths.newMoonB);

	$: if (blobContainer) {
		blobContainer.style.opacity = `${blobOpacityValue}`;
		blobContainer.style.transform = `rotate(${rotateValue}deg) translateX(${translateXValue}%)`;
		moonIllustrations.style.transform = `scale(${scaleValue}%)`;

		let newPath;

		if (value < 45) {
			newPath = newMoonToWaxingCrescent(value / 45);
			moonPhaseMask.setAttribute('d', newPath);
		}

		if (value >= 45 && value < 90) {
			newPath = waxingCrescentToFirstQuarter(
				interpolate({
					domain: [45, 90],
					range: [0, 1],
					value
				})
			);
			moonPhaseMask.setAttribute('d', newPath);
		}

		if (value >= 90 && value < 180) {
			newPath = firstQuarterToFullMoon(
				interpolate({
					domain: [90, 180],
					range: [0, 1],
					value
				})
			);
			moonPhaseMask.setAttribute('d', newPath);
		}

		if (value >= 180 && value < 270) {
			newPath = fullMoonToLastQuarter(
				interpolate({
					domain: [180, 270],
					range: [0, 1],
					value
				})
			);
			moonPhaseMask.setAttribute('d', newPath);
		}

		if (value >= 270 && value < 315) {
			newPath = lastQuarterToWaningCrescent(
				interpolate({
					domain: [270, 315],
					range: [0, 1],
					value
				})
			);
			moonPhaseMask.setAttribute('d', newPath);
		}

		if (value >= 315 && value < 360) {
			newPath = waningCrescentToNewMoon(
				interpolate({
					domain: [315, 360],
					range: [0, 1],
					value
				})
			);
			moonPhaseMask.setAttribute('d', newPath);
		}

		if (value >= 360) {
			moonPhaseMask.setAttribute('d', paths.newMoonB);
		}
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

				<clipPath id="moonPhase">
					<path bind:this={moonPhaseMask} d={paths.newMoonA} />
				</clipPath>

				<filter id="moonBlur" x="0" y="0">
					<feGaussianBlur in="SourceGraphic" stdDeviation="20" />
				</filter>

				<filter id="glow">
					<feGaussianBlur stdDeviation="20" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			<g clip-path="url(#moonClip)">
				<circle
					fill="#FFFFFF"
					clip-path="url(#moonPhase)"
					style="filter:url(#moonBlur)"
					r="100"
					cy="100"
					cx="100"
				/>
				<g class="blobs" bind:this={blobContainer}>
					<path class="blob" d={blobs.middle} fill="#B3B3B3" />
					<path class="blob" d={blobs.bottom} fill="#E6E6E6" />
					<path class="blob" d={blobs.top} fill="rgba(0, 0, 0, 0.5)" />
					<path class="blob" d={blobs.middleAccent} fill="#E6E6E6" />
					<path class="blob" d={blobs.topAccent} fill="#E6E6E6" />
					<path class="blob" d={blobs.bottomAccent} fill="#B3B3B3" />
					<path class="blob" d={blobs.middleTertiary} fill="#B3B3B3" />
				</g>
			</g>
		</svg>

		<!-- TODO: Remove this when no longer needed for testing  -->
		<!-- <div class="flex moonLabel">
			<label for="ecliptic">Ecliptic Longitude</label>: {value}
		</div>
		<div class="rangeContainer">
			<p>{min}</p>
			<input bind:value type="range" id="ecliptic" name="ecliptic" {min} {max} />
			<p>{max}</p>
		</div> -->

		<div class="flex moonLabel">
			<p class="currentPhase">{phasesByDate[chosenDate].phase}</p>
			<p>
				<label class="currentDate" for="date">{currentMonth} {chosenDate}</label>
			</p>
		</div>
		<div class="rangeContainer">
			<p class="rangeLabel">{currentMonth} {dateMin}</p>
			<input
				bind:value={chosenDate}
				type="range"
				id="date"
				name="date"
				min={dateMin}
				max={dateMax}
			/>
			<p class="rangeLabel">{currentMonth} {dateMax}</p>
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
	.rangeLabel {
		color: #e4edff;
		font-size: 0.875rem;
	}
	.currentPhase {
		font-size: 3rem;
		font-family: 'swear-display', serif;
		font-weight: 500;
		font-style: normal;
		line-height: 1.25;
		color: #d4dae4;
	}

	.currentDate {
		color: rgba(212, 218, 228, 0.8);
		font-size: 1.125rem;
	}

	.moon {
		max-height: 50vh;
	}

	.blobs {
		opacity: 0.5;
		transition: all 0.2 ease-in;
	}
	.moonLabel {
		margin-top: 2rem;
		text-align: center;
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
		margin-top: 2.5rem;
	}

	/* https://www.smashingmagazine.com/2021/12/create-custom-range-input-consistent-browsers/ */
	/* Reset default styles, which vary wildly between browsers */
	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		background: transparent;
		cursor: pointer;
		width: 15rem;
		margin: 0 1.125rem;
	}

	/* Removes default focus */
	input[type='range']:focus {
		outline: none;
	}

	/* Chrome, Safari, Opera and Edge Chromium styles */
	/* slider track */
	input[type='range']::-webkit-slider-runnable-track {
		background-color: #426e90;
		border-radius: 0.5rem;
		height: 0.5rem;
	}

	/* slider thumb */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none; /* Override default look */
		appearance: none;
		margin-top: -12px; /* Centers thumb on the track */

		/*custom styles*/
		background-color: #e4edff;
		height: 2rem;
		width: 1rem;
		border-radius: 3px;
	}

	input[type='range']:focus::-webkit-slider-thumb {
		border: 1px solid #e4edff;
		outline: 3px solid #e4edff;
		outline-offset: 0.125rem;
	}

	/* Firefox styles */
	/* slider track */
	input[type='range']::-moz-range-track {
		background-color: #426e90;
		border-radius: 0.5rem;
		height: 0.5rem;
	}

	/* slider thumb */
	input[type='range']::-moz-range-thumb {
		border: none; /*Removes extra border that FF applies*/

		/*custom styles*/
		background-color: #e4edff;
		height: 2rem;
		width: 1rem;
		border-radius: 3px;
	}

	input[type='range']:focus::-moz-range-thumb {
		border: 1px solid #053a5f;
		outline: 3px solid #053a5f;
		outline-offset: 0.125rem;
	}
</style>
