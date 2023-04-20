<script lang="ts">
	import { spline } from '$lib/spline';
	import { interpolate, getRandomNumber } from '$lib/math-utils';
	import { onMount } from 'svelte';
	import * as flubber from 'flubber';
	import { getDate, format } from 'date-fns';
	import type { MoonPhase } from '$lib/moon-utils';
	import { animate } from 'motion';
	import { moonPaths } from '$lib/consts';

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
	let value: number = 0;
	$: value = phasesByDate[chosenDate].ecliptic_longitude;

	let currentPhaseRef: HTMLElement;
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

	let blobs = {
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
			const numPoints = getRandomNumber(15, 20);
			// step used to place each point at equal distances
			const angleStep = (Math.PI * 2) / numPoints;

			// keep track of your points
			const points = [];
			const [pullMin, pullMax] = pullRange;
			const [xSize, ySize] = size;

			for (let i = 1; i <= numPoints; i++) {
				// how much randomness should be added to each point
				const pull = getRandomNumber(pullMin, pullMax, true);

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

	let newMoonToWaxingCrescent = flubberInterpolate(moonPaths.newMoonA, moonPaths.waxingCrescent);
	let waxingCrescentToFirstQuarter = flubberInterpolate(
		moonPaths.waxingCrescent,
		moonPaths.firstQuarter
	);
	let firstQuarterToFullMoon = flubberInterpolate(moonPaths.firstQuarter, moonPaths.fullMoon);
	let fullMoonToLastQuarter = flubberInterpolate(moonPaths.fullMoon, moonPaths.lastQuarter);
	let lastQuarterToWaningCrescent = flubberInterpolate(
		moonPaths.lastQuarter,
		moonPaths.waningCrescent
	);
	let waningCrescentToNewMoon = flubberInterpolate(moonPaths.waningCrescent, moonPaths.newMoonB);

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
			moonPhaseMask.setAttribute('d', moonPaths.newMoonB);
		}
	}

	const updatePhase = async (nextValue) => {
		const nextPhase = phasesByDate[nextValue].phase;
		if (nextPhase !== chosenPhase) {
			await animate(currentPhaseRef, { opacity: 0, duration: 0.3 }).finished;
			chosenPhase = nextPhase;
			animate(currentPhaseRef, { opacity: 1 }).finished;
		}
	};
</script>

<main class="moonVisContainer">
	<div class="moonContainer" bind:this={moonContainer}>
		<svg bind:this={moonIllustrations} viewBox="0 0 200 200" class="moon" aria-hidden="true">
			<defs>
				<clipPath id="moonClip">
					<circle cx="100" cy="100" r="100" />
				</clipPath>

				<clipPath id="moonPhase">
					<path bind:this={moonPhaseMask} d={moonPaths.newMoonA} />
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

			<g clip-path="url(#moonClip)" filter="url(#glow)">
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
			<p class="currentPhase" bind:this={currentPhaseRef}>{chosenPhase}</p>
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
				on:input={(e) => {
					updatePhase(e.target.value);
				}}
			/>
			<p class="rangeLabel">{currentMonth} {dateMax}</p>
		</div>
	</div>
</main>

<style>
	.rangeLabel {
		color: #e4edff;
		font-size: 0.875rem;
	}
	.currentPhase {
		font-size: 1.5rem;
		font-family: 'swear-display', serif;
		font-weight: 500;
		font-style: normal;
		line-height: 1.25;
		color: #d4dae4;
	}

	@media (min-width: 48rem) {
		.currentPhase {
			font-size: 3rem;
		}
	}

	.currentDate {
		color: rgba(212, 218, 228, 0.8);
		font-size: 1rem;
	}

	@media (min-width: 48rem) {
		.currentDate {
			font-size: 1.125rem;
		}
	}

	.moon {
		width: 80%;
	}

	@media (min-width: 48rem) {
		.moon {
			max-height: 50vh;
		}
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
		margin: 4rem auto;
		align-items: center;
		width: 80%;
	}

	@media (min-width: 48rem) {
		.moonVisContainer {
			max-width: 40rem;
			margin: 6rem auto;
		}
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
		margin: 0 1.125rem;
	}

	@media (min-width: 48rem) {
		input[type='range'] {
			width: 15rem;
		}
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
