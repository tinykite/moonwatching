/**
    @preserve

    Astronomy library for JavaScript (browser and Node.js).
    https://github.com/cosinekitty/astronomy

    MIT License

    Copyright (c) 2019-2023 Don Cross <cosinekitty@gmail.com>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

/**
 * @fileoverview Astronomy calculation library for browser scripting and Node.js.
 * @author Don Cross <cosinekitty@gmail.com>
 * @license MIT
 */

export type FlexibleDateTime = Date | number | AstroTime;

/**
 * @brief The speed of light in AU/day.
 */
export const C_AUDAY = 173.1446326846693;

/**
 * @brief The number of kilometers per astronomical unit.
 */
export const KM_PER_AU = 1.4959787069098932e8;

/**
 * @brief The number of astronomical units per light-year.
 */
export const AU_PER_LY = 63241.07708807546;

/**
 * @brief The factor to convert degrees to radians = pi/180.
 */
export const DEG2RAD = 0.017453292519943296;

/**
 * @brief The factor to convert sidereal hours to radians = pi/12.
 */
export const HOUR2RAD = 0.2617993877991494365;

/**
 * @brief The factor to convert radians to degrees = 180/pi.
 */
export const RAD2DEG = 57.295779513082321;

/**
 * @brief The factor to convert radians to sidereal hours = 12/pi.
 */
export const RAD2HOUR = 3.819718634205488;

// Jupiter radius data are nominal values obtained from:
// https://www.iau.org/static/resolutions/IAU2015_English.pdf
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html

/**
 * @brief The equatorial radius of Jupiter, expressed in kilometers.
 */
export const JUPITER_EQUATORIAL_RADIUS_KM = 71492.0;

/**
 * @brief The polar radius of Jupiter, expressed in kilometers.
 */
export const JUPITER_POLAR_RADIUS_KM = 66854.0;

/**
 * @brief The volumetric mean radius of Jupiter, expressed in kilometers.
 */
export const JUPITER_MEAN_RADIUS_KM = 69911.0;

// The radii of Jupiter's four major moons are obtained from:
// https://ssd.jpl.nasa.gov/?sat_phys_par

/**
 * @brief The mean radius of Jupiter's moon Io, expressed in kilometers.
 */
export const IO_RADIUS_KM = 1821.6;

/**
 * @brief The mean radius of Jupiter's moon Europa, expressed in kilometers.
 */
export const EUROPA_RADIUS_KM = 1560.8;

/**
 * @brief The mean radius of Jupiter's moon Ganymede, expressed in kilometers.
 */
export const GANYMEDE_RADIUS_KM = 2631.2;

/**
 * @brief The mean radius of Jupiter's moon Callisto, expressed in kilometers.
 */
export const CALLISTO_RADIUS_KM = 2410.3;

const DAYS_PER_TROPICAL_YEAR = 365.24217;
const J2000 = new Date('2000-01-01T12:00:00Z');
const PI2 = 2 * Math.PI;
const ARC = 3600 * (180 / Math.PI); // arcseconds per radian
const ASEC2RAD = 4.848136811095359935899141e-6;
const ASEC180 = 180 * 60 * 60; // arcseconds per 180 degrees (or pi radians)
const ASEC360 = 2 * ASEC180; // arcseconds per 360 degrees (or 2*pi radians)
const ANGVEL = 7.292115e-5;
const AU_PER_PARSEC = ASEC180 / Math.PI; // exact definition of how many AU = one parsec
const SUN_MAG_1AU = -0.17 - 5 * Math.log10(AU_PER_PARSEC); // formula from JPL Horizons
const MEAN_SYNODIC_MONTH = 29.530588; // average number of days for Moon to return to the same phase
const SECONDS_PER_DAY = 24 * 3600;
const MILLIS_PER_DAY = SECONDS_PER_DAY * 1000;
const SOLAR_DAYS_PER_SIDEREAL_DAY = 0.9972695717592592;

const SUN_RADIUS_KM = 695700.0;
const SUN_RADIUS_AU = SUN_RADIUS_KM / KM_PER_AU;

const EARTH_FLATTENING = 0.996647180302104;
const EARTH_FLATTENING_SQUARED = EARTH_FLATTENING * EARTH_FLATTENING;
const EARTH_EQUATORIAL_RADIUS_KM = 6378.1366;
const EARTH_EQUATORIAL_RADIUS_AU = EARTH_EQUATORIAL_RADIUS_KM / KM_PER_AU;
const EARTH_POLAR_RADIUS_KM = EARTH_EQUATORIAL_RADIUS_KM * EARTH_FLATTENING;
const EARTH_MEAN_RADIUS_KM = 6371.0; /* mean radius of the Earth's geoid, without atmosphere */
const EARTH_ATMOSPHERE_KM = 88.0; /* effective atmosphere thickness for lunar eclipses */
const EARTH_ECLIPSE_RADIUS_KM = EARTH_MEAN_RADIUS_KM + EARTH_ATMOSPHERE_KM;

const MOON_EQUATORIAL_RADIUS_KM = 1738.1;
const MOON_EQUATORIAL_RADIUS_AU = MOON_EQUATORIAL_RADIUS_KM / KM_PER_AU;
const MOON_MEAN_RADIUS_KM = 1737.4;
const MOON_POLAR_RADIUS_KM = 1736.0;
const MOON_POLAR_RADIUS_AU = MOON_POLAR_RADIUS_KM / KM_PER_AU;

const REFRACTION_NEAR_HORIZON = 34 / 60; // degrees of refractive "lift" seen for objects near horizon
const EARTH_MOON_MASS_RATIO = 81.30056;

/*
    Masses of the Sun and outer planets, used for:
    (1) Calculating the Solar System Barycenter
    (2) Integrating the movement of Pluto

    https://web.archive.org/web/20120220062549/http://iau-comm4.jpl.nasa.gov/de405iom/de405iom.pdf

    Page 10 in the above document describes the constants used in the DE405 ephemeris.
    The following are G*M values (gravity constant * mass) in [au^3 / day^2].
    This side-steps issues of not knowing the exact values of G and masses M[i];
    the products GM[i] are known extremely accurately.
*/
const SUN_GM = 0.2959122082855911e-3;
const MERCURY_GM = 0.4912547451450812e-10;
const VENUS_GM = 0.7243452486162703e-9;
const EARTH_GM = 0.8887692390113509e-9;
const MARS_GM = 0.9549535105779258e-10;
const JUPITER_GM = 0.2825345909524226e-6;
const SATURN_GM = 0.8459715185680659e-7;
const URANUS_GM = 0.1292024916781969e-7;
const NEPTUNE_GM = 0.1524358900784276e-7;
const PLUTO_GM = 0.218869976542597e-11;

const MOON_GM = EARTH_GM / EARTH_MOON_MASS_RATIO;

/**
 * @brief Returns the product of mass and universal gravitational constant of a Solar System body.
 *
 * For problems involving the gravitational interactions of Solar System bodies,
 * it is helpful to know the product GM, where G = the universal gravitational constant
 * and M = the mass of the body. In practice, GM is known to a higher precision than
 * either G or M alone, and thus using the product results in the most accurate results.
 * This function returns the product GM in the units au^3/day^2.
 * The values come from page 10 of a
 * [JPL memorandum regarding the DE405/LE405 ephemeris](https://web.archive.org/web/20120220062549/http://iau-comm4.jpl.nasa.gov/de405iom/de405iom.pdf).
 *
 * @param {Body} body
 *      The body for which to find the GM product.
 *      Allowed to be the Sun, Moon, EMB (Earth/Moon Barycenter), or any planet.
 *      Any other value will cause an exception to be thrown.
 *
 * @returns {number}
 *      The mass product of the given body in au^3/day^2.
 */
export function MassProduct(body: Body): number {
	switch (body) {
		case Body.Sun:
			return SUN_GM;
		case Body.Mercury:
			return MERCURY_GM;
		case Body.Venus:
			return VENUS_GM;
		case Body.Earth:
			return EARTH_GM;
		case Body.Moon:
			return MOON_GM;
		case Body.EMB:
			return EARTH_GM + MOON_GM;
		case Body.Mars:
			return MARS_GM;
		case Body.Jupiter:
			return JUPITER_GM;
		case Body.Saturn:
			return SATURN_GM;
		case Body.Uranus:
			return URANUS_GM;
		case Body.Neptune:
			return NEPTUNE_GM;
		case Body.Pluto:
			return PLUTO_GM;
		default:
			throw `Do not know mass product for body: ${body}`;
	}
}

function VerifyBoolean(b: boolean): boolean {
	if (b !== true && b !== false) {
		console.trace();
		throw `Value is not boolean: ${b}`;
	}
	return b;
}

function VerifyNumber(x: number): number {
	if (!Number.isFinite(x)) {
		console.trace();
		throw `Value is not a finite number: ${x}`;
	}
	return x;
}

function Frac(x: number): number {
	return x - Math.floor(x);
}

/**
 * @brief Calculates the angle in degrees between two vectors.
 *
 * Given a pair of vectors, this function returns the angle in degrees
 * between the two vectors in 3D space.
 * The angle is measured in the plane that contains both vectors.
 *
 * @param {Vector} a
 *      The first of a pair of vectors between which to measure an angle.
 *
 * @param {Vector} b
 *      The second of a pair of vectors between which to measure an angle.
 *
 * @returns {number}
 *      The angle between the two vectors expressed in degrees.
 *      The value is in the range [0, 180].
 */
export function AngleBetween(a: Vector, b: Vector): number {
	const aa = a.x * a.x + a.y * a.y + a.z * a.z;
	if (Math.abs(aa) < 1.0e-8) throw `AngleBetween: first vector is too short.`;

	const bb = b.x * b.x + b.y * b.y + b.z * b.z;
	if (Math.abs(bb) < 1.0e-8) throw `AngleBetween: second vector is too short.`;

	const dot = (a.x * b.x + a.y * b.y + a.z * b.z) / Math.sqrt(aa * bb);

	if (dot <= -1.0) return 180;

	if (dot >= +1.0) return 0;

	return RAD2DEG * Math.acos(dot);
}

/**
 * @brief String constants that represent the solar system bodies supported by Astronomy Engine.
 *
 * The following strings represent solar system bodies supported by various Astronomy Engine functions.
 * Not every body is supported by every function; consult the documentation for each function
 * to find which bodies it supports.
 *
 * "Sun", "Moon", "Mercury", "Venus", "Earth", "Mars", "Jupiter",
 * "Saturn", "Uranus", "Neptune", "Pluto",
 * "SSB" (Solar System Barycenter),
 * "EMB" (Earth/Moon Barycenter)
 *
 * You can also use enumeration syntax for the bodies, like
 * `Astronomy.Body.Moon`, `Astronomy.Body.Jupiter`, etc.
 *
 * @enum {string}
 */
export enum Body {
	Sun = 'Sun',
	Moon = 'Moon',
	Mercury = 'Mercury',
	Venus = 'Venus',
	Earth = 'Earth',
	Mars = 'Mars',
	Jupiter = 'Jupiter',
	Saturn = 'Saturn',
	Uranus = 'Uranus',
	Neptune = 'Neptune',
	Pluto = 'Pluto',
	SSB = 'SSB', // Solar System Barycenter
	EMB = 'EMB', // Earth/Moon Barycenter

	// User-defined fixed locations in the sky...
	Star1 = 'Star1',
	Star2 = 'Star2',
	Star3 = 'Star3',
	Star4 = 'Star4',
	Star5 = 'Star5',
	Star6 = 'Star6',
	Star7 = 'Star7',
	Star8 = 'Star8'
}

const StarList = [
	Body.Star1,
	Body.Star2,
	Body.Star3,
	Body.Star4,
	Body.Star5,
	Body.Star6,
	Body.Star7,
	Body.Star8
];

interface StarDef {
	ra: number; // EQJ right ascension
	dec: number; // EQJ declination
	dist: number; // heliocentric distance in AU
}

const StarTable: StarDef[] = [
	{ ra: 0, dec: 0, dist: 0 }, // Body.Star1
	{ ra: 0, dec: 0, dist: 0 }, // Body.Star2
	{ ra: 0, dec: 0, dist: 0 }, // Body.Star3
	{ ra: 0, dec: 0, dist: 0 }, // Body.Star4
	{ ra: 0, dec: 0, dist: 0 }, // Body.Star5
	{ ra: 0, dec: 0, dist: 0 }, // Body.Star6
	{ ra: 0, dec: 0, dist: 0 }, // Body.Star7
	{ ra: 0, dec: 0, dist: 0 } // Body.Star8
];

function GetStar(body: Body): StarDef | null {
	const index = StarList.indexOf(body);
	return index >= 0 ? StarTable[index] : null;
}

function UserDefinedStar(body: Body): StarDef | null {
	const star = GetStar(body);
	return star && star.dist > 0 ? star : null;
}

/**
 * @brief Assign equatorial coordinates to a user-defined star.
 *
 * Some Astronomy Engine functions allow their `body` parameter to
 * be a user-defined fixed point in the sky, loosely called a "star".
 * This function assigns a right ascension, declination, and distance
 * to one of the eight user-defined stars `Star1`..`Star8`.
 *
 * Stars are not valid until defined. Once defined, they retain their
 * definition until re-defined by another call to `DefineStar`.
 *
 * @param {Body} body
 *      One of the eight user-defined star identifiers:
 *      `Star1`, `Star2`, `Star3`, `Star4`, `Star5`, `Star6`, `Star7`, or `Star8`.
 *
 * @param {number} ra
 *      The right ascension to be assigned to the star, expressed in J2000 equatorial coordinates (EQJ).
 *      The value is in units of sidereal hours, and must be within the half-open range [0, 24).
 *
 * @param {number} dec
 *      The declination to be assigned to the star, expressed in J2000 equatorial coordinates (EQJ).
 *      The value is in units of degrees north (positive) or south (negative) of the J2000 equator,
 *      and must be within the closed range [-90, +90].
 *
 * @param {number} distanceLightYears
 *      The distance between the star and the Sun, expressed in light-years.
 *      This value is used to calculate the tiny parallax shift as seen by an observer on Earth.
 *      If you don't know the distance to the star, using a large value like 1000 will generally work well.
 *      The minimum allowed distance is 1 light-year, which is required to provide certain internal optimizations.
 */
export function DefineStar(body: Body, ra: number, dec: number, distanceLightYears: number) {
	const star = GetStar(body);
	if (!star) throw `Invalid star body: ${body}`;

	VerifyNumber(ra);
	VerifyNumber(dec);
	VerifyNumber(distanceLightYears);

	if (ra < 0 || ra >= 24) throw `Invalid right ascension for star: ${ra}`;

	if (dec < -90 || dec > +90) throw `Invalid declination for star: ${dec}`;

	if (distanceLightYears < 1) throw `Invalid star distance: ${distanceLightYears}`;

	star.ra = ra;
	star.dec = dec;
	star.dist = distanceLightYears * AU_PER_LY;
}

enum PrecessDirection {
	From2000,
	Into2000
}

interface PlanetInfo {
	OrbitalPeriod: number;
}

interface PlanetTable {
	[body: string]: PlanetInfo;
}

const Planet: PlanetTable = {
	Mercury: { OrbitalPeriod: 87.969 },
	Venus: { OrbitalPeriod: 224.701 },
	Earth: { OrbitalPeriod: 365.256 },
	Mars: { OrbitalPeriod: 686.98 },
	Jupiter: { OrbitalPeriod: 4332.589 },
	Saturn: { OrbitalPeriod: 10759.22 },
	Uranus: { OrbitalPeriod: 30685.4 },
	Neptune: { OrbitalPeriod: 60189.0 },
	Pluto: { OrbitalPeriod: 90560.0 }
};

/**
 * @brief Returns the mean orbital period of a planet in days.
 *
 * @param {Body} body
 *      One of: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, or Pluto.
 *
 * @returns {number}
 *      The approximate average time it takes for the planet to travel once around the Sun.
 *      The value is expressed in days.
 */
export function PlanetOrbitalPeriod(body: Body): number {
	if (body in Planet) return Planet[body].OrbitalPeriod;

	throw `Unknown orbital period for: ${body}`;
}

type VsopModel = number[][][][];

interface VsopTable {
	[body: string]: VsopModel;
}

const vsop: VsopTable = {
	Mercury: [
		[
			[
				[4.40250710144, 0.0, 0.0],
				[0.40989414977, 1.48302034195, 26087.9031415742],
				[0.050462942, 4.47785489551, 52175.8062831484],
				[0.00855346844, 1.16520322459, 78263.70942472259],
				[0.00165590362, 4.11969163423, 104351.61256629678],
				[0.00034561897, 0.77930768443, 130439.51570787099],
				[0.00007583476, 3.71348404924, 156527.41884944518]
			],
			[
				[26087.90313685529, 0.0, 0.0],
				[0.01131199811, 6.21874197797, 26087.9031415742],
				[0.00292242298, 3.04449355541, 52175.8062831484],
				[0.00075775081, 6.08568821653, 78263.70942472259],
				[0.00019676525, 2.80965111777, 104351.61256629678]
			]
		],
		[
			[
				[0.11737528961, 1.98357498767, 26087.9031415742],
				[0.02388076996, 5.03738959686, 52175.8062831484],
				[0.01222839532, 3.14159265359, 0.0],
				[0.0054325181, 1.79644363964, 78263.70942472259],
				[0.0012977877, 4.83232503958, 104351.61256629678],
				[0.00031866927, 1.58088495658, 130439.51570787099],
				[0.00007963301, 4.60972126127, 156527.41884944518]
			],
			[
				[0.00274646065, 3.95008450011, 26087.9031415742],
				[0.00099737713, 3.14159265359, 0.0]
			]
		],
		[
			[
				[0.39528271651, 0.0, 0.0],
				[0.07834131818, 6.19233722598, 26087.9031415742],
				[0.00795525558, 2.95989690104, 52175.8062831484],
				[0.00121281764, 6.01064153797, 78263.70942472259],
				[0.00021921969, 2.77820093972, 104351.61256629678],
				[0.00004354065, 5.82894543774, 130439.51570787099]
			],
			[
				[0.0021734774, 4.65617158665, 26087.9031415742],
				[0.00044141826, 1.42385544001, 52175.8062831484]
			]
		]
	],
	Venus: [
		[
			[
				[3.17614666774, 0.0, 0.0],
				[0.01353968419, 5.59313319619, 10213.285546211],
				[0.00089891645, 5.30650047764, 20426.571092422],
				[0.00005477194, 4.41630661466, 7860.4193924392],
				[0.00003455741, 2.6996444782, 11790.6290886588],
				[0.00002372061, 2.99377542079, 3930.2096962196],
				[0.00001317168, 5.18668228402, 26.2983197998],
				[0.00001664146, 4.25018630147, 1577.3435424478],
				[0.00001438387, 4.15745084182, 9683.5945811164],
				[0.00001200521, 6.15357116043, 30639.856638633]
			],
			[
				[10213.28554621638, 0.0, 0.0],
				[0.00095617813, 2.4640651111, 10213.285546211],
				[0.00007787201, 0.6247848222, 20426.571092422]
			]
		],
		[
			[
				[0.05923638472, 0.26702775812, 10213.285546211],
				[0.00040107978, 1.14737178112, 20426.571092422],
				[0.00032814918, 3.14159265359, 0.0]
			],
			[[0.00287821243, 1.88964962838, 10213.285546211]]
		],
		[
			[
				[0.72334820891, 0.0, 0.0],
				[0.00489824182, 4.02151831717, 10213.285546211],
				[0.00001658058, 4.90206728031, 20426.571092422],
				[0.00001378043, 1.12846591367, 11790.6290886588],
				[0.00001632096, 2.84548795207, 7860.4193924392],
				[0.00000498395, 2.58682193892, 9683.5945811164],
				[0.00000221985, 2.01346696541, 19367.1891622328],
				[0.00000237454, 2.55136053886, 15720.8387848784]
			],
			[[0.00034551041, 0.89198706276, 10213.285546211]]
		]
	],
	Earth: [
		[
			[
				[1.75347045673, 0.0, 0.0],
				[0.03341656453, 4.66925680415, 6283.0758499914],
				[0.00034894275, 4.62610242189, 12566.1516999828],
				[0.00003417572, 2.82886579754, 3.523118349],
				[0.00003497056, 2.74411783405, 5753.3848848968],
				[0.00003135899, 3.62767041756, 77713.7714681205],
				[0.00002676218, 4.41808345438, 7860.4193924392],
				[0.00002342691, 6.13516214446, 3930.2096962196],
				[0.00001273165, 2.03709657878, 529.6909650946],
				[0.00001324294, 0.74246341673, 11506.7697697936],
				[0.00000901854, 2.04505446477, 26.2983197998],
				[0.00001199167, 1.10962946234, 1577.3435424478],
				[0.00000857223, 3.50849152283, 398.1490034082],
				[0.00000779786, 1.17882681962, 5223.6939198022],
				[0.0000099025, 5.23268072088, 5884.9268465832],
				[0.00000753141, 2.53339052847, 5507.5532386674],
				[0.00000505267, 4.58292599973, 18849.2275499742],
				[0.00000492392, 4.20505711826, 775.522611324],
				[0.00000356672, 2.91954114478, 0.0673103028],
				[0.00000284125, 1.89869240932, 796.2980068164],
				[0.00000242879, 0.34481445893, 5486.777843175],
				[0.00000317087, 5.84901948512, 11790.6290886588],
				[0.00000271112, 0.31486255375, 10977.078804699],
				[0.00000206217, 4.80646631478, 2544.3144198834],
				[0.00000205478, 1.86953770281, 5573.1428014331],
				[0.00000202318, 2.45767790232, 6069.7767545534],
				[0.00000126225, 1.08295459501, 20.7753954924],
				[0.00000155516, 0.83306084617, 213.299095438]
			],
			[
				[6283.0758499914, 0.0, 0.0],
				[0.00206058863, 2.67823455808, 6283.0758499914],
				[0.00004303419, 2.63512233481, 12566.1516999828]
			],
			[[0.00008721859, 1.07253635559, 6283.0758499914]]
		],
		[
			[],
			[
				[0.00227777722, 3.4137662053, 6283.0758499914],
				[0.00003805678, 3.37063423795, 12566.1516999828]
			]
		],
		[
			[
				[1.00013988784, 0.0, 0.0],
				[0.01670699632, 3.09846350258, 6283.0758499914],
				[0.00013956024, 3.05524609456, 12566.1516999828],
				[0.0000308372, 5.19846674381, 77713.7714681205],
				[0.00001628463, 1.17387558054, 5753.3848848968],
				[0.00001575572, 2.84685214877, 7860.4193924392],
				[0.00000924799, 5.45292236722, 11506.7697697936],
				[0.00000542439, 4.56409151453, 3930.2096962196],
				[0.0000047211, 3.66100022149, 5884.9268465832],
				[0.00000085831, 1.27079125277, 161000.6857376741],
				[0.00000057056, 2.01374292245, 83996.84731811189],
				[0.00000055736, 5.2415979917, 71430.69561812909],
				[0.00000174844, 3.01193636733, 18849.2275499742],
				[0.00000243181, 4.2734953079, 11790.6290886588]
			],
			[
				[0.00103018607, 1.10748968172, 6283.0758499914],
				[0.00001721238, 1.06442300386, 12566.1516999828]
			],
			[[0.00004359385, 5.78455133808, 6283.0758499914]]
		]
	],
	Mars: [
		[
			[
				[6.20347711581, 0.0, 0.0],
				[0.18656368093, 5.0503710027, 3340.6124266998],
				[0.01108216816, 5.40099836344, 6681.2248533996],
				[0.00091798406, 5.75478744667, 10021.8372800994],
				[0.00027744987, 5.97049513147, 3.523118349],
				[0.00010610235, 2.93958560338, 2281.2304965106],
				[0.00012315897, 0.84956094002, 2810.9214616052],
				[0.00008926784, 4.15697846427, 0.0172536522],
				[0.00008715691, 6.11005153139, 13362.4497067992],
				[0.00006797556, 0.36462229657, 398.1490034082],
				[0.00007774872, 3.33968761376, 5621.8429232104],
				[0.00003575078, 1.6618650571, 2544.3144198834],
				[0.00004161108, 0.22814971327, 2942.4634232916],
				[0.00003075252, 0.85696614132, 191.4482661116],
				[0.00002628117, 0.64806124465, 3337.0893083508],
				[0.00002937546, 6.07893711402, 0.0673103028],
				[0.00002389414, 5.03896442664, 796.2980068164],
				[0.00002579844, 0.02996736156, 3344.1355450488],
				[0.00001528141, 1.14979301996, 6151.533888305],
				[0.00001798806, 0.65634057445, 529.6909650946],
				[0.00001264357, 3.62275122593, 5092.1519581158],
				[0.00001286228, 3.06796065034, 2146.1654164752],
				[0.00001546404, 2.91579701718, 1751.539531416],
				[0.00001024902, 3.69334099279, 8962.4553499102],
				[0.00000891566, 0.18293837498, 16703.062133499],
				[0.00000858759, 2.4009381194, 2914.0142358238],
				[0.00000832715, 2.46418619474, 3340.5951730476],
				[0.0000083272, 4.49495782139, 3340.629680352],
				[0.00000712902, 3.66335473479, 1059.3819301892],
				[0.00000748723, 3.82248614017, 155.4203994342],
				[0.00000723861, 0.67497311481, 3738.761430108],
				[0.00000635548, 2.92182225127, 8432.7643848156],
				[0.00000655162, 0.48864064125, 3127.3133312618],
				[0.00000550474, 3.81001042328, 0.9803210682],
				[0.0000055275, 4.47479317037, 1748.016413067],
				[0.00000425966, 0.55364317304, 6283.0758499914],
				[0.00000415131, 0.49662285038, 213.299095438],
				[0.00000472167, 3.62547124025, 1194.4470102246],
				[0.00000306551, 0.38052848348, 6684.7479717486],
				[0.00000312141, 0.99853944405, 6677.7017350506],
				[0.00000293198, 4.22131299634, 20.7753954924],
				[0.00000302375, 4.48618007156, 3532.0606928114],
				[0.00000274027, 0.54222167059, 3340.545116397],
				[0.00000281079, 5.88163521788, 1349.8674096588],
				[0.00000231183, 1.28242156993, 3870.3033917944],
				[0.00000283602, 5.7688543494, 3149.1641605882],
				[0.00000236117, 5.75503217933, 3333.498879699],
				[0.00000274033, 0.13372524985, 3340.6797370026],
				[0.00000299395, 2.78323740866, 6254.6266625236]
			],
			[
				[3340.61242700512, 0.0, 0.0],
				[0.01457554523, 3.60433733236, 3340.6124266998],
				[0.00168414711, 3.92318567804, 6681.2248533996],
				[0.00020622975, 4.26108844583, 10021.8372800994],
				[0.00003452392, 4.7321039319, 3.523118349],
				[0.00002586332, 4.60670058555, 13362.4497067992],
				[0.00000841535, 4.45864030426, 2281.2304965106]
			],
			[
				[0.00058152577, 2.04961712429, 3340.6124266998],
				[0.00013459579, 2.45738706163, 6681.2248533996]
			]
		],
		[
			[
				[0.03197134986, 3.76832042431, 3340.6124266998],
				[0.00298033234, 4.10616996305, 6681.2248533996],
				[0.00289104742, 0.0, 0.0],
				[0.00031365539, 4.4465105309, 10021.8372800994],
				[0.000034841, 4.7881254926, 13362.4497067992]
			],
			[
				[0.00217310991, 6.04472194776, 3340.6124266998],
				[0.00020976948, 3.14159265359, 0.0],
				[0.00012834709, 1.60810667915, 6681.2248533996]
			]
		],
		[
			[
				[1.53033488271, 0.0, 0.0],
				[0.1418495316, 3.47971283528, 3340.6124266998],
				[0.00660776362, 3.81783443019, 6681.2248533996],
				[0.00046179117, 4.15595316782, 10021.8372800994],
				[0.00008109733, 5.55958416318, 2810.9214616052],
				[0.00007485318, 1.77239078402, 5621.8429232104],
				[0.00005523191, 1.3643630377, 2281.2304965106],
				[0.0000382516, 4.49407183687, 13362.4497067992],
				[0.00002306537, 0.09081579001, 2544.3144198834],
				[0.00001999396, 5.36059617709, 3337.0893083508],
				[0.00002484394, 4.9254563992, 2942.4634232916],
				[0.00001960195, 4.74249437639, 3344.1355450488],
				[0.00001167119, 2.11260868341, 5092.1519581158],
				[0.00001102816, 5.00908403998, 398.1490034082],
				[0.00000899066, 4.40791133207, 529.6909650946],
				[0.00000992252, 5.83861961952, 6151.533888305],
				[0.00000807354, 2.10217065501, 1059.3819301892],
				[0.00000797915, 3.44839203899, 796.2980068164],
				[0.00000740975, 1.49906336885, 2146.1654164752]
			],
			[
				[0.01107433345, 2.03250524857, 3340.6124266998],
				[0.00103175887, 2.37071847807, 6681.2248533996],
				[0.000128772, 0.0, 0.0],
				[0.0001081588, 2.70888095665, 10021.8372800994]
			],
			[
				[0.00044242249, 0.47930604954, 3340.6124266998],
				[0.00008138042, 0.86998389204, 6681.2248533996]
			]
		]
	],
	Jupiter: [
		[
			[
				[0.59954691494, 0.0, 0.0],
				[0.09695898719, 5.06191793158, 529.6909650946],
				[0.00573610142, 1.44406205629, 7.1135470008],
				[0.00306389205, 5.41734730184, 1059.3819301892],
				[0.00097178296, 4.14264726552, 632.7837393132],
				[0.00072903078, 3.64042916389, 522.5774180938],
				[0.00064263975, 3.41145165351, 103.0927742186],
				[0.00039806064, 2.29376740788, 419.4846438752],
				[0.00038857767, 1.27231755835, 316.3918696566],
				[0.00027964629, 1.7845459182, 536.8045120954],
				[0.0001358973, 5.7748104079, 1589.0728952838],
				[0.00008246349, 3.5822792584, 206.1855484372],
				[0.00008768704, 3.63000308199, 949.1756089698],
				[0.00007368042, 5.0810119427, 735.8765135318],
				[0.0000626315, 0.02497628807, 213.299095438],
				[0.00006114062, 4.51319998626, 1162.4747044078],
				[0.00004905396, 1.32084470588, 110.2063212194],
				[0.00005305285, 1.30671216791, 14.2270940016],
				[0.00005305441, 4.18625634012, 1052.2683831884],
				[0.00004647248, 4.69958103684, 3.9321532631],
				[0.00003045023, 4.31676431084, 426.598190876],
				[0.00002609999, 1.56667394063, 846.0828347512],
				[0.00002028191, 1.06376530715, 3.1813937377],
				[0.00001764763, 2.14148655117, 1066.49547719],
				[0.00001722972, 3.88036268267, 1265.5674786264],
				[0.00001920945, 0.97168196472, 639.897286314],
				[0.00001633223, 3.58201833555, 515.463871093],
				[0.00001431999, 4.29685556046, 625.6701923124],
				[0.00000973272, 4.09764549134, 95.9792272178]
			],
			[
				[529.69096508814, 0.0, 0.0],
				[0.00489503243, 4.2208293947, 529.6909650946],
				[0.00228917222, 6.02646855621, 7.1135470008],
				[0.00030099479, 4.54540782858, 1059.3819301892],
				[0.0002072092, 5.45943156902, 522.5774180938],
				[0.00012103653, 0.16994816098, 536.8045120954],
				[0.00006067987, 4.42422292017, 103.0927742186],
				[0.00005433968, 3.98480737746, 419.4846438752],
				[0.00004237744, 5.89008707199, 14.2270940016]
			],
			[
				[0.00047233601, 4.32148536482, 7.1135470008],
				[0.00030649436, 2.929777887, 529.6909650946],
				[0.00014837605, 3.14159265359, 0.0]
			]
		],
		[
			[
				[0.02268615702, 3.55852606721, 529.6909650946],
				[0.00109971634, 3.90809347197, 1059.3819301892],
				[0.00110090358, 0.0, 0.0],
				[0.00008101428, 3.60509572885, 522.5774180938],
				[0.00006043996, 4.25883108339, 1589.0728952838],
				[0.00006437782, 0.30627119215, 536.8045120954]
			],
			[[0.00078203446, 1.52377859742, 529.6909650946]]
		],
		[
			[
				[5.20887429326, 0.0, 0.0],
				[0.25209327119, 3.49108639871, 529.6909650946],
				[0.00610599976, 3.84115365948, 1059.3819301892],
				[0.00282029458, 2.57419881293, 632.7837393132],
				[0.00187647346, 2.07590383214, 522.5774180938],
				[0.00086792905, 0.71001145545, 419.4846438752],
				[0.00072062974, 0.21465724607, 536.8045120954],
				[0.00065517248, 5.9799588479, 316.3918696566],
				[0.00029134542, 1.67759379655, 103.0927742186],
				[0.00030135335, 2.16132003734, 949.1756089698],
				[0.00023453271, 3.54023522184, 735.8765135318],
				[0.00022283743, 4.19362594399, 1589.0728952838],
				[0.00023947298, 0.2745803748, 7.1135470008],
				[0.00013032614, 2.96042965363, 1162.4747044078],
				[0.0000970336, 1.90669633585, 206.1855484372],
				[0.00012749023, 2.71550286592, 1052.2683831884],
				[0.00007057931, 2.18184839926, 1265.5674786264],
				[0.00006137703, 6.26418240033, 846.0828347512],
				[0.00002616976, 2.00994012876, 1581.959348283]
			],
			[
				[0.0127180152, 2.64937512894, 529.6909650946],
				[0.00061661816, 3.00076460387, 1059.3819301892],
				[0.00053443713, 3.89717383175, 522.5774180938],
				[0.00031185171, 4.88276958012, 536.8045120954],
				[0.00041390269, 0.0, 0.0]
			]
		]
	],
	Saturn: [
		[
			[
				[0.87401354025, 0.0, 0.0],
				[0.11107659762, 3.96205090159, 213.299095438],
				[0.01414150957, 4.58581516874, 7.1135470008],
				[0.00398379389, 0.52112032699, 206.1855484372],
				[0.00350769243, 3.30329907896, 426.598190876],
				[0.00206816305, 0.24658372002, 103.0927742186],
				[0.000792713, 3.84007056878, 220.4126424388],
				[0.00023990355, 4.66976924553, 110.2063212194],
				[0.00016573588, 0.43719228296, 419.4846438752],
				[0.00014906995, 5.76903183869, 316.3918696566],
				[0.0001582029, 0.93809155235, 632.7837393132],
				[0.00014609559, 1.56518472, 3.9321532631],
				[0.00013160301, 4.44891291899, 14.2270940016],
				[0.00015053543, 2.71669915667, 639.897286314],
				[0.00013005299, 5.98119023644, 11.0457002639],
				[0.00010725067, 3.12939523827, 202.2533951741],
				[0.00005863206, 0.23656938524, 529.6909650946],
				[0.00005227757, 4.20783365759, 3.1813937377],
				[0.00006126317, 1.76328667907, 277.0349937414],
				[0.00005019687, 3.17787728405, 433.7117378768],
				[0.0000459255, 0.61977744975, 199.0720014364],
				[0.00004005867, 2.24479718502, 63.7358983034],
				[0.00002953796, 0.98280366998, 95.9792272178],
				[0.0000387367, 3.22283226966, 138.5174968707],
				[0.00002461186, 2.03163875071, 735.8765135318],
				[0.00003269484, 0.77492638211, 949.1756089698],
				[0.00001758145, 3.2658010994, 522.5774180938],
				[0.00001640172, 5.5050445305, 846.0828347512],
				[0.00001391327, 4.02333150505, 323.5054166574],
				[0.00001580648, 4.37265307169, 309.2783226558],
				[0.00001123498, 2.83726798446, 415.5524906121],
				[0.00001017275, 3.71700135395, 227.5261894396],
				[0.00000848642, 3.1915017083, 209.3669421749]
			],
			[
				[213.2990952169, 0.0, 0.0],
				[0.01297370862, 1.82834923978, 213.299095438],
				[0.00564345393, 2.88499717272, 7.1135470008],
				[0.00093734369, 1.06311793502, 426.598190876],
				[0.00107674962, 2.27769131009, 206.1855484372],
				[0.00040244455, 2.04108104671, 220.4126424388],
				[0.00019941774, 1.2795439047, 103.0927742186],
				[0.00010511678, 2.7488034213, 14.2270940016],
				[0.00006416106, 0.38238295041, 639.897286314],
				[0.00004848994, 2.43037610229, 419.4846438752],
				[0.00004056892, 2.92133209468, 110.2063212194],
				[0.00003768635, 3.6496533078, 3.9321532631]
			],
			[
				[0.0011644133, 1.17988132879, 7.1135470008],
				[0.00091841837, 0.0732519584, 213.299095438],
				[0.00036661728, 0.0, 0.0],
				[0.00015274496, 4.06493179167, 206.1855484372]
			]
		],
		[
			[
				[0.04330678039, 3.60284428399, 213.299095438],
				[0.00240348302, 2.85238489373, 426.598190876],
				[0.00084745939, 0.0, 0.0],
				[0.00030863357, 3.48441504555, 220.4126424388],
				[0.00034116062, 0.57297307557, 206.1855484372],
				[0.0001473407, 2.11846596715, 639.897286314],
				[0.00009916667, 5.79003188904, 419.4846438752],
				[0.00006993564, 4.7360468972, 7.1135470008],
				[0.00004807588, 5.43305312061, 316.3918696566]
			],
			[
				[0.00198927992, 4.93901017903, 213.299095438],
				[0.00036947916, 3.14159265359, 0.0],
				[0.00017966989, 0.5197943111, 426.598190876]
			]
		],
		[
			[
				[9.55758135486, 0.0, 0.0],
				[0.52921382865, 2.39226219573, 213.299095438],
				[0.01873679867, 5.2354960466, 206.1855484372],
				[0.01464663929, 1.64763042902, 426.598190876],
				[0.00821891141, 5.93520042303, 316.3918696566],
				[0.00547506923, 5.0153261898, 103.0927742186],
				[0.0037168465, 2.27114821115, 220.4126424388],
				[0.00361778765, 3.13904301847, 7.1135470008],
				[0.00140617506, 5.70406606781, 632.7837393132],
				[0.00108974848, 3.29313390175, 110.2063212194],
				[0.00069006962, 5.94099540992, 419.4846438752],
				[0.00061053367, 0.94037691801, 639.897286314],
				[0.00048913294, 1.55733638681, 202.2533951741],
				[0.00034143772, 0.19519102597, 277.0349937414],
				[0.00032401773, 5.47084567016, 949.1756089698],
				[0.00020936596, 0.46349251129, 735.8765135318],
				[0.00009796004, 5.20477537945, 1265.5674786264],
				[0.00011993338, 5.98050967385, 846.0828347512],
				[0.000208393, 1.52102476129, 433.7117378768],
				[0.00015298404, 3.0594381494, 529.6909650946],
				[0.00006465823, 0.17732249942, 1052.2683831884],
				[0.00011380257, 1.7310542704, 522.5774180938],
				[0.00003419618, 4.94550542171, 1581.959348283]
			],
			[
				[0.0618298134, 0.2584351148, 213.299095438],
				[0.00506577242, 0.71114625261, 206.1855484372],
				[0.00341394029, 5.79635741658, 426.598190876],
				[0.00188491195, 0.47215589652, 220.4126424388],
				[0.00186261486, 3.14159265359, 0.0],
				[0.00143891146, 1.40744822888, 7.1135470008]
			],
			[[0.00436902572, 4.78671677509, 213.299095438]]
		]
	],
	Uranus: [
		[
			[
				[5.48129294297, 0.0, 0.0],
				[0.09260408234, 0.89106421507, 74.7815985673],
				[0.01504247898, 3.6271926092, 1.4844727083],
				[0.00365981674, 1.89962179044, 73.297125859],
				[0.00272328168, 3.35823706307, 149.5631971346],
				[0.00070328461, 5.39254450063, 63.7358983034],
				[0.00068892678, 6.09292483287, 76.2660712756],
				[0.00061998615, 2.26952066061, 2.9689454166],
				[0.00061950719, 2.85098872691, 11.0457002639],
				[0.0002646877, 3.14152083966, 71.8126531507],
				[0.00025710476, 6.11379840493, 454.9093665273],
				[0.0002107885, 4.36059339067, 148.0787244263],
				[0.00017818647, 1.74436930289, 36.6485629295],
				[0.00014613507, 4.73732166022, 3.9321532631],
				[0.00011162509, 5.8268179635, 224.3447957019],
				[0.0001099791, 0.48865004018, 138.5174968707],
				[0.00009527478, 2.95516862826, 35.1640902212],
				[0.00007545601, 5.236265824, 109.9456887885],
				[0.00004220241, 3.23328220918, 70.8494453042],
				[0.000040519, 2.277550173, 151.0476698429],
				[0.00003354596, 1.0654900738, 4.4534181249],
				[0.00002926718, 4.62903718891, 9.5612275556],
				[0.0000349034, 5.48306144511, 146.594251718],
				[0.00003144069, 4.75199570434, 77.7505439839],
				[0.00002922333, 5.35235361027, 85.8272988312],
				[0.00002272788, 4.36600400036, 70.3281804424],
				[0.00002051219, 1.51773566586, 0.1118745846],
				[0.00002148602, 0.60745949945, 38.1330356378],
				[0.00001991643, 4.92437588682, 277.0349937414],
				[0.00001376226, 2.04283539351, 65.2203710117],
				[0.00001666902, 3.62744066769, 380.12776796],
				[0.00001284107, 3.11347961505, 202.2533951741],
				[0.00001150429, 0.93343589092, 3.1813937377],
				[0.00001533221, 2.58594681212, 52.6901980395],
				[0.00001281604, 0.54271272721, 222.8603229936],
				[0.00001372139, 4.19641530878, 111.4301614968],
				[0.00001221029, 0.1990065003, 108.4612160802],
				[0.00000946181, 1.19253165736, 127.4717966068],
				[0.00001150989, 4.17898916639, 33.6796175129]
			],
			[
				[74.7815986091, 0.0, 0.0],
				[0.00154332863, 5.24158770553, 74.7815985673],
				[0.00024456474, 1.71260334156, 1.4844727083],
				[0.00009258442, 0.4282973235, 11.0457002639],
				[0.00008265977, 1.50218091379, 63.7358983034],
				[0.0000915016, 1.41213765216, 149.5631971346]
			]
		],
		[
			[
				[0.01346277648, 2.61877810547, 74.7815985673],
				[0.000623414, 5.08111189648, 149.5631971346],
				[0.00061601196, 3.14159265359, 0.0],
				[0.00009963722, 1.61603805646, 76.2660712756],
				[0.0000992616, 0.57630380333, 73.297125859]
			],
			[[0.00034101978, 0.01321929936, 74.7815985673]]
		],
		[
			[
				[19.21264847206, 0.0, 0.0],
				[0.88784984413, 5.60377527014, 74.7815985673],
				[0.03440836062, 0.32836099706, 73.297125859],
				[0.0205565386, 1.7829515933, 149.5631971346],
				[0.0064932241, 4.52247285911, 76.2660712756],
				[0.00602247865, 3.86003823674, 63.7358983034],
				[0.00496404167, 1.40139935333, 454.9093665273],
				[0.00338525369, 1.58002770318, 138.5174968707],
				[0.00243509114, 1.57086606044, 71.8126531507],
				[0.00190522303, 1.99809394714, 1.4844727083],
				[0.00161858838, 2.79137786799, 148.0787244263],
				[0.00143706183, 1.38368544947, 11.0457002639],
				[0.00093192405, 0.17437220467, 36.6485629295],
				[0.00071424548, 4.24509236074, 224.3447957019],
				[0.00089806014, 3.66105364565, 109.9456887885],
				[0.00039009723, 1.66971401684, 70.8494453042],
				[0.00046677296, 1.39976401694, 35.1640902212],
				[0.00039025624, 3.36234773834, 277.0349937414],
				[0.00036755274, 3.88649278513, 146.594251718],
				[0.00030348723, 0.70100838798, 151.0476698429],
				[0.00029156413, 3.180563367, 77.7505439839],
				[0.00022637073, 0.72518687029, 529.6909650946],
				[0.00011959076, 1.7504339214, 984.6003316219],
				[0.00025620756, 5.25656086672, 380.12776796]
			],
			[[0.01479896629, 3.67205697578, 74.7815985673]]
		]
	],
	Neptune: [
		[
			[
				[5.31188633046, 0.0, 0.0],
				[0.0179847553, 2.9010127389, 38.1330356378],
				[0.01019727652, 0.48580922867, 1.4844727083],
				[0.00124531845, 4.83008090676, 36.6485629295],
				[0.00042064466, 5.41054993053, 2.9689454166],
				[0.00037714584, 6.09221808686, 35.1640902212],
				[0.00033784738, 1.24488874087, 76.2660712756],
				[0.00016482741, 0.00007727998, 491.5579294568],
				[0.00009198584, 4.93747051954, 39.6175083461],
				[0.0000899425, 0.27462171806, 175.1660598002]
			],
			[
				[38.13303563957, 0.0, 0.0],
				[0.00016604172, 4.86323329249, 1.4844727083],
				[0.00015744045, 2.27887427527, 38.1330356378]
			]
		],
		[
			[
				[0.03088622933, 1.44104372644, 38.1330356378],
				[0.00027780087, 5.91271884599, 76.2660712756],
				[0.00027623609, 0.0, 0.0],
				[0.00015355489, 2.52123799551, 36.6485629295],
				[0.00015448133, 3.50877079215, 39.6175083461]
			]
		],
		[
			[
				[30.07013205828, 0.0, 0.0],
				[0.27062259632, 1.32999459377, 38.1330356378],
				[0.01691764014, 3.25186135653, 36.6485629295],
				[0.00807830553, 5.18592878704, 1.4844727083],
				[0.0053776051, 4.52113935896, 35.1640902212],
				[0.00495725141, 1.5710564165, 491.5579294568],
				[0.00274571975, 1.84552258866, 175.1660598002],
				[0.0001201232, 1.92059384991, 1021.2488945514],
				[0.00121801746, 5.79754470298, 76.2660712756],
				[0.00100896068, 0.3770272493, 73.297125859],
				[0.00135134092, 3.37220609835, 39.6175083461],
				[0.00007571796, 1.07149207335, 388.4651552382]
			]
		]
	]
};

export function DeltaT_EspenakMeeus(ut: number): number {
	var u: number, u2: number, u3: number, u4: number, u5: number, u6: number, u7: number;

	/*
        Fred Espenak writes about Delta-T generically here:
        https://eclipse.gsfc.nasa.gov/SEhelp/deltaT.html
        https://eclipse.gsfc.nasa.gov/SEhelp/deltat2004.html

        He provides polynomial approximations for distant years here:
        https://eclipse.gsfc.nasa.gov/SEhelp/deltatpoly2004.html

        They start with a year value 'y' such that y=2000 corresponds
        to the UTC Date 15-January-2000. Convert difference in days
        to mean tropical years.
    */

	const y = 2000 + (ut - 14) / DAYS_PER_TROPICAL_YEAR;

	if (y < -500) {
		u = (y - 1820) / 100;
		return -20 + 32 * u * u;
	}
	if (y < 500) {
		u = y / 100;
		u2 = u * u;
		u3 = u * u2;
		u4 = u2 * u2;
		u5 = u2 * u3;
		u6 = u3 * u3;
		return (
			10583.6 -
			1014.41 * u +
			33.78311 * u2 -
			5.952053 * u3 -
			0.1798452 * u4 +
			0.022174192 * u5 +
			0.0090316521 * u6
		);
	}
	if (y < 1600) {
		u = (y - 1000) / 100;
		u2 = u * u;
		u3 = u * u2;
		u4 = u2 * u2;
		u5 = u2 * u3;
		u6 = u3 * u3;
		return (
			1574.2 -
			556.01 * u +
			71.23472 * u2 +
			0.319781 * u3 -
			0.8503463 * u4 -
			0.005050998 * u5 +
			0.0083572073 * u6
		);
	}
	if (y < 1700) {
		u = y - 1600;
		u2 = u * u;
		u3 = u * u2;
		return 120 - 0.9808 * u - 0.01532 * u2 + u3 / 7129.0;
	}
	if (y < 1800) {
		u = y - 1700;
		u2 = u * u;
		u3 = u * u2;
		u4 = u2 * u2;
		return 8.83 + 0.1603 * u - 0.0059285 * u2 + 0.00013336 * u3 - u4 / 1174000;
	}
	if (y < 1860) {
		u = y - 1800;
		u2 = u * u;
		u3 = u * u2;
		u4 = u2 * u2;
		u5 = u2 * u3;
		u6 = u3 * u3;
		u7 = u3 * u4;
		return (
			13.72 -
			0.332447 * u +
			0.0068612 * u2 +
			0.0041116 * u3 -
			0.00037436 * u4 +
			0.0000121272 * u5 -
			0.0000001699 * u6 +
			0.000000000875 * u7
		);
	}
	if (y < 1900) {
		u = y - 1860;
		u2 = u * u;
		u3 = u * u2;
		u4 = u2 * u2;
		u5 = u2 * u3;
		return 7.62 + 0.5737 * u - 0.251754 * u2 + 0.01680668 * u3 - 0.0004473624 * u4 + u5 / 233174;
	}
	if (y < 1920) {
		u = y - 1900;
		u2 = u * u;
		u3 = u * u2;
		u4 = u2 * u2;
		return -2.79 + 1.494119 * u - 0.0598939 * u2 + 0.0061966 * u3 - 0.000197 * u4;
	}
	if (y < 1941) {
		u = y - 1920;
		u2 = u * u;
		u3 = u * u2;
		return 21.2 + 0.84493 * u - 0.0761 * u2 + 0.0020936 * u3;
	}
	if (y < 1961) {
		u = y - 1950;
		u2 = u * u;
		u3 = u * u2;
		return 29.07 + 0.407 * u - u2 / 233 + u3 / 2547;
	}
	if (y < 1986) {
		u = y - 1975;
		u2 = u * u;
		u3 = u * u2;
		return 45.45 + 1.067 * u - u2 / 260 - u3 / 718;
	}
	if (y < 2005) {
		u = y - 2000;
		u2 = u * u;
		u3 = u * u2;
		u4 = u2 * u2;
		u5 = u2 * u3;
		return (
			63.86 + 0.3345 * u - 0.060374 * u2 + 0.0017275 * u3 + 0.000651814 * u4 + 0.00002373599 * u5
		);
	}
	if (y < 2050) {
		u = y - 2000;
		return 62.92 + 0.32217 * u + 0.005589 * u * u;
	}
	if (y < 2150) {
		u = (y - 1820) / 100;
		return -20 + 32 * u * u - 0.5628 * (2150 - y);
	}

	/* all years after 2150 */
	u = (y - 1820) / 100;
	return -20 + 32 * u * u;
}

export type DeltaTimeFunction = (ut: number) => number;

export function DeltaT_JplHorizons(ut: number): number {
	return DeltaT_EspenakMeeus(Math.min(ut, 17.0 * DAYS_PER_TROPICAL_YEAR));
}

let DeltaT: DeltaTimeFunction = DeltaT_EspenakMeeus;

export function SetDeltaTFunction(func: DeltaTimeFunction) {
	DeltaT = func;
}

/**
 * @ignore
 *
 * @brief Calculates Terrestrial Time (TT) from Universal Time (UT).
 *
 * @param {number} ut
 *      The Universal Time expressed as a floating point number of days since the 2000.0 epoch.
 *
 * @returns {number}
 *      A Terrestrial Time expressed as a floating point number of days since the 2000.0 epoch.
 */
function TerrestrialTime(ut: number): number {
	return ut + DeltaT(ut) / 86400;
}

/**
 * @brief The date and time of an astronomical observation.
 *
 * Objects of type `AstroTime` are used throughout the internals
 * of the Astronomy library, and are included in certain return objects.
 * Use the constructor or the {@link MakeTime} function to create an `AstroTime` object.
 *
 * @property {Date} date
 *      The JavaScript Date object for the given date and time.
 *      This Date corresponds to the numeric day value stored in the `ut` property.
 *
 * @property {number} ut
 *      Universal Time (UT1/UTC) in fractional days since the J2000 epoch.
 *      Universal Time represents time measured with respect to the Earth's rotation,
 *      tracking mean solar days.
 *      The Astronomy library approximates UT1 and UTC as being the same thing.
 *      This gives sufficient accuracy for the precision requirements of this project.
 *
 * @property {number} tt
 *      Terrestrial Time in fractional days since the J2000 epoch.
 *      TT represents a continuously flowing ephemeris timescale independent of
 *      any variations of the Earth's rotation, and is adjusted from UT
 *      using a best-fit piecewise polynomial model devised by
 *      [Espenak and Meeus](https://eclipse.gsfc.nasa.gov/SEhelp/deltatpoly2004.html).
 */
export class AstroTime {
	date: Date;
	ut: number;
	tt: number;

	/**
	 * @param {FlexibleDateTime} date
	 *      A JavaScript Date object, a numeric UTC value expressed in J2000 days, or another AstroTime object.
	 */
	constructor(date: FlexibleDateTime) {
		if (date instanceof AstroTime) {
			// Construct a clone of the AstroTime passed in.
			this.date = date.date;
			this.ut = date.ut;
			this.tt = date.tt;
			return;
		}

		const MillisPerDay = 1000 * 3600 * 24;

		if (date instanceof Date && Number.isFinite(date.getTime())) {
			this.date = date;
			this.ut = (date.getTime() - J2000.getTime()) / MillisPerDay;
			this.tt = TerrestrialTime(this.ut);
			return;
		}

		if (Number.isFinite(date)) {
			this.date = new Date(J2000.getTime() + <number>date * MillisPerDay);
			this.ut = <number>date;
			this.tt = TerrestrialTime(this.ut);
			return;
		}

		throw 'Argument must be a Date object, an AstroTime object, or a numeric UTC Julian date.';
	}

	/**
	 * @brief Creates an `AstroTime` value from a Terrestrial Time (TT) day value.
	 *
	 * This function can be used in rare cases where a time must be based
	 * on Terrestrial Time (TT) rather than Universal Time (UT).
	 * Most developers will want to invoke `new AstroTime(ut)` with a universal time
	 * instead of this function, because usually time is based on civil time adjusted
	 * by leap seconds to match the Earth's rotation, rather than the uniformly
	 * flowing TT used to calculate solar system dynamics. In rare cases
	 * where the caller already knows TT, this function is provided to create
	 * an `AstroTime` value that can be passed to Astronomy Engine functions.
	 *
	 * @param {number} tt
	 *      The number of days since the J2000 epoch as expressed in Terrestrial Time.
	 *
	 * @returns {AstroTime}
	 *      An `AstroTime` object for the specified terrestrial time.
	 */
	static FromTerrestrialTime(tt: number): AstroTime {
		let time = new AstroTime(tt);
		for (;;) {
			const err = tt - time.tt;
			if (Math.abs(err) < 1.0e-12) return time;
			time = time.AddDays(err);
		}
	}

	/**
	 * Formats an `AstroTime` object as an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
	 * date/time string in UTC, to millisecond resolution.
	 * Example: `2018-08-17T17:22:04.050Z`
	 * @returns {string}
	 */
	toString(): string {
		return this.date.toISOString();
	}

	/**
	 * Returns a new `AstroTime` object adjusted by the floating point number of days.
	 * Does NOT modify the original `AstroTime` object.
	 *
	 * @param {number} days
	 *      The floating point number of days by which to adjust the given date and time.
	 *      Positive values adjust the date toward the future, and
	 *      negative values adjust the date toward the past.
	 *
	 * @returns {AstroTime}
	 */
	AddDays(days: number): AstroTime {
		// This is slightly wrong, but the error is tiny.
		// We really should be adding to TT, not to UT.
		// But using TT would require creating an inverse function for DeltaT,
		// which would be quite a bit of extra calculation.
		// I estimate the error is in practice on the order of 10^(-7)
		// times the value of 'days'.
		// This is based on a typical drift of 1 second per year between UT and TT.
		return new AstroTime(this.ut + days);
	}
}

function InterpolateTime(time1: AstroTime, time2: AstroTime, fraction: number): AstroTime {
	return new AstroTime(time1.ut + fraction * (time2.ut - time1.ut));
}

/**
 * @brief A `Date`, `number`, or `AstroTime` value that specifies the date and time of an astronomical event.
 *
 * `FlexibleDateTime` is a placeholder type that represents three different types
 * that may be passed to many Astronomy Engine functions: a JavaScript `Date` object,
 * a number representing the real-valued number of UT days since the J2000 epoch,
 * or an {@link AstroTime} object.
 *
 * This flexibility is for convenience of outside callers.
 * Internally, Astronomy Engine always converts a `FlexibleDateTime` parameter
 * to an `AstroTime` object by calling {@link MakeTime}.
 *
 * @typedef {Date | number | AstroTime} FlexibleDateTime
 */

/**
 * @brief Converts multiple date/time formats to `AstroTime` format.
 *
 * Given a Date object or a number days since noon (12:00) on January 1, 2000 (UTC),
 * this function creates an {@link AstroTime} object.
 *
 * Given an {@link AstroTime} object, returns the same object unmodified.
 * Use of this function is not required for any of the other exposed functions in this library,
 * because they all guarantee converting date/time parameters to `AstroTime`
 * as needed. However, it may be convenient for callers who need to understand
 * the difference between UTC and TT (Terrestrial Time). In some use cases,
 * converting once to `AstroTime` format and passing the result into multiple
 * function calls may be more efficient than passing in native JavaScript Date objects.
 *
 * @param {FlexibleDateTime} date
 *      A Date object, a number of UTC days since the J2000 epoch (noon on January 1, 2000),
 *      or an AstroTime object. See remarks above.
 *
 * @returns {AstroTime}
 */
export function MakeTime(date: FlexibleDateTime): AstroTime {
	if (date instanceof AstroTime) {
		return date;
	}
	return new AstroTime(date);
}

interface NutationAngles {
	dpsi: number;
	deps: number;
}

function iau2000b(time: AstroTime): NutationAngles {
	function mod(x: number): number {
		return (x % ASEC360) * ASEC2RAD;
	}

	const t = time.tt / 36525;
	const elp = mod(1287104.79305 + t * 129596581.0481);
	const f = mod(335779.526232 + t * 1739527262.8478);
	const d = mod(1072260.70369 + t * 1602961601.209);
	const om = mod(450160.398036 - t * 6962890.5431);

	let sarg = Math.sin(om);
	let carg = Math.cos(om);
	let dp = (-172064161.0 - 174666.0 * t) * sarg + 33386.0 * carg;
	let de = (92052331.0 + 9086.0 * t) * carg + 15377.0 * sarg;

	let arg = 2.0 * (f - d + om);
	sarg = Math.sin(arg);
	carg = Math.cos(arg);
	dp += (-13170906.0 - 1675.0 * t) * sarg - 13696.0 * carg;
	de += (5730336.0 - 3015.0 * t) * carg - 4587.0 * sarg;

	arg = 2.0 * (f + om);
	sarg = Math.sin(arg);
	carg = Math.cos(arg);
	dp += (-2276413.0 - 234.0 * t) * sarg + 2796.0 * carg;
	de += (978459.0 - 485.0 * t) * carg + 1374.0 * sarg;

	arg = 2.0 * om;
	sarg = Math.sin(arg);
	carg = Math.cos(arg);
	dp += (2074554.0 + 207.0 * t) * sarg - 698.0 * carg;
	de += (-897492.0 + 470.0 * t) * carg - 291.0 * sarg;

	sarg = Math.sin(elp);
	carg = Math.cos(elp);
	dp += (1475877.0 - 3633.0 * t) * sarg + 11817.0 * carg;
	de += (73871.0 - 184.0 * t) * carg - 1924.0 * sarg;

	return {
		dpsi: -0.000135 + dp * 1.0e-7,
		deps: +0.000388 + de * 1.0e-7
	};
}

function mean_obliq(time: AstroTime): number {
	var t = time.tt / 36525;
	var asec =
		((((-0.0000000434 * t - 0.000000576) * t + 0.0020034) * t - 0.0001831) * t - 46.836769) * t +
		84381.406;
	return asec / 3600.0;
}

export interface EarthTiltInfo {
	tt: number;
	dpsi: number;
	deps: number;
	ee: number;
	mobl: number;
	tobl: number;
}

var cache_e_tilt: EarthTiltInfo;

export function e_tilt(time: AstroTime): EarthTiltInfo {
	if (!cache_e_tilt || Math.abs(cache_e_tilt.tt - time.tt) > 1.0e-6) {
		const nut = iau2000b(time);
		const mean_ob = mean_obliq(time);
		const true_ob = mean_ob + nut.deps / 3600;
		cache_e_tilt = {
			tt: time.tt,
			dpsi: nut.dpsi,
			deps: nut.deps,
			ee: (nut.dpsi * Math.cos(mean_ob * DEG2RAD)) / 15,
			mobl: mean_ob,
			tobl: true_ob
		};
	}
	return cache_e_tilt;
}

function obl_ecl2equ_vec(oblDegrees: number, pos: ArrayVector): ArrayVector {
	const obl = oblDegrees * DEG2RAD;
	const cos_obl = Math.cos(obl);
	const sin_obl = Math.sin(obl);
	return [pos[0], pos[1] * cos_obl - pos[2] * sin_obl, pos[1] * sin_obl + pos[2] * cos_obl];
}

function ecl2equ_vec(time: AstroTime, pos: ArrayVector): ArrayVector {
	return obl_ecl2equ_vec(mean_obliq(time), pos);
}

export let CalcMoonCount = 0;

function CalcMoon(time: AstroTime) {
	++CalcMoonCount;

	const T = time.tt / 36525;

	interface PascalArray1 {
		min: number;
		array: number[];
	}

	interface PascalArray2 {
		min: number;
		array: PascalArray1[];
	}

	function DeclareArray1(xmin: number, xmax: number): PascalArray1 {
		const array = [];
		let i: number;
		for (i = 0; i <= xmax - xmin; ++i) {
			array.push(0);
		}
		return { min: xmin, array: array };
	}

	function DeclareArray2(xmin: number, xmax: number, ymin: number, ymax: number): PascalArray2 {
		const array = [];
		for (let i = 0; i <= xmax - xmin; ++i) {
			array.push(DeclareArray1(ymin, ymax));
		}
		return { min: xmin, array: array };
	}

	function ArrayGet2(a: PascalArray2, x: number, y: number) {
		const m = a.array[x - a.min];
		return m.array[y - m.min];
	}

	function ArraySet2(a: PascalArray2, x: number, y: number, v: number) {
		const m = a.array[x - a.min];
		m.array[y - m.min] = v;
	}

	let S: number,
		MAX: number,
		ARG: number,
		FAC: number,
		I: number,
		J: number,
		T2: number,
		DGAM: number,
		DLAM: number,
		N: number,
		GAM1C: number,
		SINPI: number,
		L0: number,
		L: number,
		LS: number,
		F: number,
		D: number,
		DL0: number,
		DL: number,
		DLS: number,
		DF: number,
		DD: number,
		DS: number;
	let coArray = DeclareArray2(-6, 6, 1, 4);
	let siArray = DeclareArray2(-6, 6, 1, 4);

	function CO(x: number, y: number) {
		return ArrayGet2(coArray, x, y);
	}

	function SI(x: number, y: number) {
		return ArrayGet2(siArray, x, y);
	}

	function SetCO(x: number, y: number, v: number) {
		return ArraySet2(coArray, x, y, v);
	}

	function SetSI(x: number, y: number, v: number) {
		return ArraySet2(siArray, x, y, v);
	}

	type ThetaFunc = (real: number, imag: number) => void;

	function AddThe(c1: number, s1: number, c2: number, s2: number, func: ThetaFunc): void {
		func(c1 * c2 - s1 * s2, s1 * c2 + c1 * s2);
	}

	function Sine(phi: number): number {
		return Math.sin(PI2 * phi);
	}

	T2 = T * T;
	DLAM = 0;
	DS = 0;
	GAM1C = 0;
	SINPI = 3422.7;

	var S1 = Sine(0.19833 + 0.05611 * T);
	var S2 = Sine(0.27869 + 0.04508 * T);
	var S3 = Sine(0.16827 - 0.36903 * T);
	var S4 = Sine(0.34734 - 5.37261 * T);
	var S5 = Sine(0.10498 - 5.37899 * T);
	var S6 = Sine(0.42681 - 0.41855 * T);
	var S7 = Sine(0.14943 - 5.37511 * T);
	DL0 = 0.84 * S1 + 0.31 * S2 + 14.27 * S3 + 7.26 * S4 + 0.28 * S5 + 0.24 * S6;
	DL = 2.94 * S1 + 0.31 * S2 + 14.27 * S3 + 9.34 * S4 + 1.12 * S5 + 0.83 * S6;
	DLS = -6.4 * S1 - 1.89 * S6;
	DF = 0.21 * S1 + 0.31 * S2 + 14.27 * S3 - 88.7 * S4 - 15.3 * S5 + 0.24 * S6 - 1.86 * S7;
	DD = DL0 - DLS;
	DGAM =
		-3332e-9 * Sine(0.59734 - 5.37261 * T) -
		539e-9 * Sine(0.35498 - 5.37899 * T) -
		64e-9 * Sine(0.39943 - 5.37511 * T);

	L0 = PI2 * Frac(0.60643382 + 1336.85522467 * T - 0.00000313 * T2) + DL0 / ARC;
	L = PI2 * Frac(0.37489701 + 1325.55240982 * T + 0.00002565 * T2) + DL / ARC;
	LS = PI2 * Frac(0.99312619 + 99.99735956 * T - 0.00000044 * T2) + DLS / ARC;
	F = PI2 * Frac(0.25909118 + 1342.2278298 * T - 0.00000892 * T2) + DF / ARC;
	D = PI2 * Frac(0.82736186 + 1236.85308708 * T - 0.00000397 * T2) + DD / ARC;
	for (I = 1; I <= 4; ++I) {
		switch (I) {
			case 1:
				ARG = L;
				MAX = 4;
				FAC = 1.000002208;
				break;
			case 2:
				ARG = LS;
				MAX = 3;
				FAC = 0.997504612 - 0.002495388 * T;
				break;
			case 3:
				ARG = F;
				MAX = 4;
				FAC = 1.000002708 + 139.978 * DGAM;
				break;
			case 4:
				ARG = D;
				MAX = 6;
				FAC = 1.0;
				break;
			default:
				throw `Internal error: I = ${I}`; // persuade TypeScript that ARG, ... are all initialized before use.
		}
		SetCO(0, I, 1);
		SetCO(1, I, Math.cos(ARG) * FAC);
		SetSI(0, I, 0);
		SetSI(1, I, Math.sin(ARG) * FAC);
		for (J = 2; J <= MAX; ++J) {
			AddThe(
				CO(J - 1, I),
				SI(J - 1, I),
				CO(1, I),
				SI(1, I),
				(c: number, s: number) => (SetCO(J, I, c), SetSI(J, I, s))
			);
		}
		for (J = 1; J <= MAX; ++J) {
			SetCO(-J, I, CO(J, I));
			SetSI(-J, I, -SI(J, I));
		}
	}

	interface ComplexValue {
		x: number;
		y: number;
	}

	function Term(p: number, q: number, r: number, s: number): ComplexValue {
		var result = { x: 1, y: 0 };
		var I = [0, p, q, r, s]; // I[0] is not used; it is a placeholder
		for (var k = 1; k <= 4; ++k)
			if (I[k] !== 0)
				AddThe(
					result.x,
					result.y,
					CO(I[k], k),
					SI(I[k], k),
					(c: number, s: number) => ((result.x = c), (result.y = s))
				);
		return result;
	}

	function AddSol(
		coeffl: number,
		coeffs: number,
		coeffg: number,
		coeffp: number,
		p: number,
		q: number,
		r: number,
		s: number
	): void {
		var result = Term(p, q, r, s);
		DLAM += coeffl * result.y;
		DS += coeffs * result.y;
		GAM1C += coeffg * result.x;
		SINPI += coeffp * result.x;
	}

	AddSol(13.902, 14.06, -0.001, 0.2607, 0, 0, 0, 4);
	AddSol(0.403, -4.01, 0.394, 0.0023, 0, 0, 0, 3);
	AddSol(2369.912, 2373.36, 0.601, 28.2333, 0, 0, 0, 2);
	AddSol(-125.154, -112.79, -0.725, -0.9781, 0, 0, 0, 1);
	AddSol(1.979, 6.98, -0.445, 0.0433, 1, 0, 0, 4);
	AddSol(191.953, 192.72, 0.029, 3.0861, 1, 0, 0, 2);
	AddSol(-8.466, -13.51, 0.455, -0.1093, 1, 0, 0, 1);
	AddSol(22639.5, 22609.07, 0.079, 186.5398, 1, 0, 0, 0);
	AddSol(18.609, 3.59, -0.094, 0.0118, 1, 0, 0, -1);
	AddSol(-4586.465, -4578.13, -0.077, 34.3117, 1, 0, 0, -2);
	AddSol(3.215, 5.44, 0.192, -0.0386, 1, 0, 0, -3);
	AddSol(-38.428, -38.64, 0.001, 0.6008, 1, 0, 0, -4);
	AddSol(-0.393, -1.43, -0.092, 0.0086, 1, 0, 0, -6);
	AddSol(-0.289, -1.59, 0.123, -0.0053, 0, 1, 0, 4);
	AddSol(-24.42, -25.1, 0.04, -0.3, 0, 1, 0, 2);
	AddSol(18.023, 17.93, 0.007, 0.1494, 0, 1, 0, 1);
	AddSol(-668.146, -126.98, -1.302, -0.3997, 0, 1, 0, 0);
	AddSol(0.56, 0.32, -0.001, -0.0037, 0, 1, 0, -1);
	AddSol(-165.145, -165.06, 0.054, 1.9178, 0, 1, 0, -2);
	AddSol(-1.877, -6.46, -0.416, 0.0339, 0, 1, 0, -4);
	AddSol(0.213, 1.02, -0.074, 0.0054, 2, 0, 0, 4);
	AddSol(14.387, 14.78, -0.017, 0.2833, 2, 0, 0, 2);
	AddSol(-0.586, -1.2, 0.054, -0.01, 2, 0, 0, 1);
	AddSol(769.016, 767.96, 0.107, 10.1657, 2, 0, 0, 0);
	AddSol(1.75, 2.01, -0.018, 0.0155, 2, 0, 0, -1);
	AddSol(-211.656, -152.53, 5.679, -0.3039, 2, 0, 0, -2);
	AddSol(1.225, 0.91, -0.03, -0.0088, 2, 0, 0, -3);
	AddSol(-30.773, -34.07, -0.308, 0.3722, 2, 0, 0, -4);
	AddSol(-0.57, -1.4, -0.074, 0.0109, 2, 0, 0, -6);
	AddSol(-2.921, -11.75, 0.787, -0.0484, 1, 1, 0, 2);
	AddSol(1.267, 1.52, -0.022, 0.0164, 1, 1, 0, 1);
	AddSol(-109.673, -115.18, 0.461, -0.949, 1, 1, 0, 0);
	AddSol(-205.962, -182.36, 2.056, 1.4437, 1, 1, 0, -2);
	AddSol(0.233, 0.36, 0.012, -0.0025, 1, 1, 0, -3);
	AddSol(-4.391, -9.66, -0.471, 0.0673, 1, 1, 0, -4);
	AddSol(0.283, 1.53, -0.111, 0.006, 1, -1, 0, 4);
	AddSol(14.577, 31.7, -1.54, 0.2302, 1, -1, 0, 2);
	AddSol(147.687, 138.76, 0.679, 1.1528, 1, -1, 0, 0);
	AddSol(-1.089, 0.55, 0.021, 0.0, 1, -1, 0, -1);
	AddSol(28.475, 23.59, -0.443, -0.2257, 1, -1, 0, -2);
	AddSol(-0.276, -0.38, -0.006, -0.0036, 1, -1, 0, -3);
	AddSol(0.636, 2.27, 0.146, -0.0102, 1, -1, 0, -4);
	AddSol(-0.189, -1.68, 0.131, -0.0028, 0, 2, 0, 2);
	AddSol(-7.486, -0.66, -0.037, -0.0086, 0, 2, 0, 0);
	AddSol(-8.096, -16.35, -0.74, 0.0918, 0, 2, 0, -2);
	AddSol(-5.741, -0.04, 0.0, -0.0009, 0, 0, 2, 2);
	AddSol(0.255, 0.0, 0.0, 0.0, 0, 0, 2, 1);
	AddSol(-411.608, -0.2, 0.0, -0.0124, 0, 0, 2, 0);
	AddSol(0.584, 0.84, 0.0, 0.0071, 0, 0, 2, -1);
	AddSol(-55.173, -52.14, 0.0, -0.1052, 0, 0, 2, -2);
	AddSol(0.254, 0.25, 0.0, -0.0017, 0, 0, 2, -3);
	AddSol(0.025, -1.67, 0.0, 0.0031, 0, 0, 2, -4);
	AddSol(1.06, 2.96, -0.166, 0.0243, 3, 0, 0, 2);
	AddSol(36.124, 50.64, -1.3, 0.6215, 3, 0, 0, 0);
	AddSol(-13.193, -16.4, 0.258, -0.1187, 3, 0, 0, -2);
	AddSol(-1.187, -0.74, 0.042, 0.0074, 3, 0, 0, -4);
	AddSol(-0.293, -0.31, -0.002, 0.0046, 3, 0, 0, -6);
	AddSol(-0.29, -1.45, 0.116, -0.0051, 2, 1, 0, 2);
	AddSol(-7.649, -10.56, 0.259, -0.1038, 2, 1, 0, 0);
	AddSol(-8.627, -7.59, 0.078, -0.0192, 2, 1, 0, -2);
	AddSol(-2.74, -2.54, 0.022, 0.0324, 2, 1, 0, -4);
	AddSol(1.181, 3.32, -0.212, 0.0213, 2, -1, 0, 2);
	AddSol(9.703, 11.67, -0.151, 0.1268, 2, -1, 0, 0);
	AddSol(-0.352, -0.37, 0.001, -0.0028, 2, -1, 0, -1);
	AddSol(-2.494, -1.17, -0.003, -0.0017, 2, -1, 0, -2);
	AddSol(0.36, 0.2, -0.012, -0.0043, 2, -1, 0, -4);
	AddSol(-1.167, -1.25, 0.008, -0.0106, 1, 2, 0, 0);
	AddSol(-7.412, -6.12, 0.117, 0.0484, 1, 2, 0, -2);
	AddSol(-0.311, -0.65, -0.032, 0.0044, 1, 2, 0, -4);
	AddSol(0.757, 1.82, -0.105, 0.0112, 1, -2, 0, 2);
	AddSol(2.58, 2.32, 0.027, 0.0196, 1, -2, 0, 0);
	AddSol(2.533, 2.4, -0.014, -0.0212, 1, -2, 0, -2);
	AddSol(-0.344, -0.57, -0.025, 0.0036, 0, 3, 0, -2);
	AddSol(-0.992, -0.02, 0.0, 0.0, 1, 0, 2, 2);
	AddSol(-45.099, -0.02, 0.0, -0.001, 1, 0, 2, 0);
	AddSol(-0.179, -9.52, 0.0, -0.0833, 1, 0, 2, -2);
	AddSol(-0.301, -0.33, 0.0, 0.0014, 1, 0, 2, -4);
	AddSol(-6.382, -3.37, 0.0, -0.0481, 1, 0, -2, 2);
	AddSol(39.528, 85.13, 0.0, -0.7136, 1, 0, -2, 0);
	AddSol(9.366, 0.71, 0.0, -0.0112, 1, 0, -2, -2);
	AddSol(0.202, 0.02, 0.0, 0.0, 1, 0, -2, -4);
	AddSol(0.415, 0.1, 0.0, 0.0013, 0, 1, 2, 0);
	AddSol(-2.152, -2.26, 0.0, -0.0066, 0, 1, 2, -2);
	AddSol(-1.44, -1.3, 0.0, 0.0014, 0, 1, -2, 2);
	AddSol(0.384, -0.04, 0.0, 0.0, 0, 1, -2, -2);
	AddSol(1.938, 3.6, -0.145, 0.0401, 4, 0, 0, 0);
	AddSol(-0.952, -1.58, 0.052, -0.013, 4, 0, 0, -2);
	AddSol(-0.551, -0.94, 0.032, -0.0097, 3, 1, 0, 0);
	AddSol(-0.482, -0.57, 0.005, -0.0045, 3, 1, 0, -2);
	AddSol(0.681, 0.96, -0.026, 0.0115, 3, -1, 0, 0);
	AddSol(-0.297, -0.27, 0.002, -0.0009, 2, 2, 0, -2);
	AddSol(0.254, 0.21, -0.003, 0.0, 2, -2, 0, -2);
	AddSol(-0.25, -0.22, 0.004, 0.0014, 1, 3, 0, -2);
	AddSol(-3.996, 0.0, 0.0, 0.0004, 2, 0, 2, 0);
	AddSol(0.557, -0.75, 0.0, -0.009, 2, 0, 2, -2);
	AddSol(-0.459, -0.38, 0.0, -0.0053, 2, 0, -2, 2);
	AddSol(-1.298, 0.74, 0.0, 0.0004, 2, 0, -2, 0);
	AddSol(0.538, 1.14, 0.0, -0.0141, 2, 0, -2, -2);
	AddSol(0.263, 0.02, 0.0, 0.0, 1, 1, 2, 0);
	AddSol(0.426, 0.07, 0.0, -0.0006, 1, 1, -2, -2);
	AddSol(-0.304, 0.03, 0.0, 0.0003, 1, -1, 2, 0);
	AddSol(-0.372, -0.19, 0.0, -0.0027, 1, -1, -2, 2);
	AddSol(0.418, 0.0, 0.0, 0.0, 0, 0, 4, 0);
	AddSol(-0.33, -0.04, 0.0, 0.0, 3, 0, 2, 0);

	function ADDN(coeffn: number, p: number, q: number, r: number, s: number) {
		return coeffn * Term(p, q, r, s).y;
	}

	N = 0;
	N += ADDN(-526.069, 0, 0, 1, -2);
	N += ADDN(-3.352, 0, 0, 1, -4);
	N += ADDN(+44.297, +1, 0, 1, -2);
	N += ADDN(-6.0, +1, 0, 1, -4);
	N += ADDN(+20.599, -1, 0, 1, 0);
	N += ADDN(-30.598, -1, 0, 1, -2);
	N += ADDN(-24.649, -2, 0, 1, 0);
	N += ADDN(-2.0, -2, 0, 1, -2);
	N += ADDN(-22.571, 0, +1, 1, -2);
	N += ADDN(+10.985, 0, -1, 1, -2);

	DLAM +=
		+0.82 * Sine(0.7736 - 62.5512 * T) +
		0.31 * Sine(0.0466 - 125.1025 * T) +
		0.35 * Sine(0.5785 - 25.1042 * T) +
		0.66 * Sine(0.4591 + 1335.8075 * T) +
		0.64 * Sine(0.313 - 91.568 * T) +
		1.14 * Sine(0.148 + 1331.2898 * T) +
		0.21 * Sine(0.5918 + 1056.5859 * T) +
		0.44 * Sine(0.5784 + 1322.8595 * T) +
		0.24 * Sine(0.2275 - 5.7374 * T) +
		0.28 * Sine(0.2965 + 2.6929 * T) +
		0.33 * Sine(0.3132 + 6.3368 * T);

	S = F + DS / ARC;

	let lat_seconds =
		(1.000002708 + 139.978 * DGAM) * (18518.511 + 1.189 + GAM1C) * Math.sin(S) -
		6.24 * Math.sin(3 * S) +
		N;

	return {
		geo_eclip_lon: PI2 * Frac((L0 + DLAM / ARC) / PI2),
		geo_eclip_lat: (Math.PI / (180 * 3600)) * lat_seconds,
		distance_au: (ARC * EARTH_EQUATORIAL_RADIUS_AU) / (0.999953253 * SINPI)
	};
}

/**
 * @brief Lunar libration angles, returned by {@link Libration}.
 *
 * @property {number} elat
 *      Sub-Earth libration ecliptic latitude angle, in degrees.
 * @property {number} elon
 *      Sub-Earth libration ecliptic longitude angle, in degrees.
 * @property {number} mlat
 *      Moon's geocentric ecliptic latitude, in degrees.
 * @property {number} mlon
 *      Moon's geocentric ecliptic longitude, in degrees.
 * @property {number} dist_km
 *      Distance between the centers of the Earth and Moon in kilometers.
 * @property {number} diam_deg
 *      The apparent angular diameter of the Moon, in degrees, as seen from the center of the Earth.
 */
export class LibrationInfo {
	constructor(
		public elat: number,
		public elon: number,
		public mlat: number,
		public mlon: number,
		public dist_km: number,
		public diam_deg: number
	) {}
}

/**
 * @brief Calculates the Moon's libration angles at a given moment in time.
 *
 * Libration is an observed back-and-forth wobble of the portion of the
 * Moon visible from the Earth. It is caused by the imperfect tidal locking
 * of the Moon's fixed rotation rate, compared to its variable angular speed
 * of orbit around the Earth.
 *
 * This function calculates a pair of perpendicular libration angles,
 * one representing rotation of the Moon in ecliptic longitude `elon`, the other
 * in ecliptic latitude `elat`, both relative to the Moon's mean Earth-facing position.
 *
 * This function also returns the geocentric position of the Moon
 * expressed in ecliptic longitude `mlon`, ecliptic latitude `mlat`, the
 * distance `dist_km` between the centers of the Earth and Moon expressed in kilometers,
 * and the apparent angular diameter of the Moon `diam_deg`.
 *
 * @param {FlexibleDateTime} date
 *      A Date object, a number of UTC days since the J2000 epoch (noon on January 1, 2000),
 *      or an AstroTime object.
 *
 * @returns {LibrationInfo}
 */
export function Libration(date: FlexibleDateTime): LibrationInfo {
	const time = MakeTime(date);
	const t = time.tt / 36525.0;
	const t2 = t * t;
	const t3 = t2 * t;
	const t4 = t2 * t2;
	const moon = CalcMoon(time);
	const mlon = moon.geo_eclip_lon;
	const mlat = moon.geo_eclip_lat;
	const dist_km = moon.distance_au * KM_PER_AU;

	// Inclination angle
	const I = DEG2RAD * 1.543;

	// Moon's argument of latitude in radians.
	const f =
		DEG2RAD *
		NormalizeLongitude(
			93.272095 + 483202.0175233 * t - 0.0036539 * t2 - t3 / 3526000 + t4 / 863310000
		);

	// Moon's ascending node's mean longitude in radians.
	const omega =
		DEG2RAD *
		NormalizeLongitude(
			125.0445479 - 1934.1362891 * t + 0.0020754 * t2 + t3 / 467441 - t4 / 60616000
		);

	// Sun's mean anomaly.
	const m =
		DEG2RAD * NormalizeLongitude(357.5291092 + 35999.0502909 * t - 0.0001536 * t2 + t3 / 24490000);

	// Moon's mean anomaly.
	const mdash =
		DEG2RAD *
		NormalizeLongitude(
			134.9633964 + 477198.8675055 * t + 0.0087414 * t2 + t3 / 69699 - t4 / 14712000
		);

	// Moon's mean elongation.
	const d =
		DEG2RAD *
		NormalizeLongitude(
			297.8501921 + 445267.1114034 * t - 0.0018819 * t2 + t3 / 545868 - t4 / 113065000
		);

	// Eccentricity of the Earth's orbit.
	const e = 1.0 - 0.002516 * t - 0.0000074 * t2;

	// Optical librations
	const w = mlon - omega;
	const a = Math.atan2(
		Math.sin(w) * Math.cos(mlat) * Math.cos(I) - Math.sin(mlat) * Math.sin(I),
		Math.cos(w) * Math.cos(mlat)
	);
	const ldash = LongitudeOffset(RAD2DEG * (a - f));
	const bdash = Math.asin(
		-Math.sin(w) * Math.cos(mlat) * Math.sin(I) - Math.sin(mlat) * Math.cos(I)
	);

	// Physical librations
	const k1 = DEG2RAD * (119.75 + 131.849 * t);
	const k2 = DEG2RAD * (72.56 + 20.186 * t);

	const rho =
		-0.02752 * Math.cos(mdash) +
		-0.02245 * Math.sin(f) +
		+0.00684 * Math.cos(mdash - 2 * f) +
		-0.00293 * Math.cos(2 * f) +
		-0.00085 * Math.cos(2 * f - 2 * d) +
		-0.00054 * Math.cos(mdash - 2 * d) +
		-0.0002 * Math.sin(mdash + f) +
		-0.0002 * Math.cos(mdash + 2 * f) +
		-0.0002 * Math.cos(mdash - f) +
		+0.00014 * Math.cos(mdash + 2 * f - 2 * d);

	const sigma =
		-0.02816 * Math.sin(mdash) +
		+0.02244 * Math.cos(f) +
		-0.00682 * Math.sin(mdash - 2 * f) +
		-0.00279 * Math.sin(2 * f) +
		-0.00083 * Math.sin(2 * f - 2 * d) +
		+0.00069 * Math.sin(mdash - 2 * d) +
		+0.0004 * Math.cos(mdash + f) +
		-0.00025 * Math.sin(2 * mdash) +
		-0.00023 * Math.sin(mdash + 2 * f) +
		+0.0002 * Math.cos(mdash - f) +
		+0.00019 * Math.sin(mdash - f) +
		+0.00013 * Math.sin(mdash + 2 * f - 2 * d) +
		-0.0001 * Math.cos(mdash - 3 * f);

	const tau =
		+0.0252 * e * Math.sin(m) +
		+0.00473 * Math.sin(2 * mdash - 2 * f) +
		-0.00467 * Math.sin(mdash) +
		+0.00396 * Math.sin(k1) +
		+0.00276 * Math.sin(2 * mdash - 2 * d) +
		+0.00196 * Math.sin(omega) +
		-0.00183 * Math.cos(mdash - f) +
		+0.00115 * Math.sin(mdash - 2 * d) +
		-0.00096 * Math.sin(mdash - d) +
		+0.00046 * Math.sin(2 * f - 2 * d) +
		-0.00039 * Math.sin(mdash - f) +
		-0.00032 * Math.sin(mdash - m - d) +
		+0.00027 * Math.sin(2 * mdash - m - 2 * d) +
		+0.00023 * Math.sin(k2) +
		-0.00014 * Math.sin(2 * d) +
		+0.00014 * Math.cos(2 * mdash - 2 * f) +
		-0.00012 * Math.sin(mdash - 2 * f) +
		-0.00012 * Math.sin(2 * mdash) +
		+0.00011 * Math.sin(2 * mdash - 2 * m - 2 * d);

	const ldash2 = -tau + (rho * Math.cos(a) + sigma * Math.sin(a)) * Math.tan(bdash);
	const bdash2 = sigma * Math.cos(a) - rho * Math.sin(a);
	const diam_deg =
		2.0 *
		RAD2DEG *
		Math.atan(
			MOON_MEAN_RADIUS_KM / Math.sqrt(dist_km * dist_km - MOON_MEAN_RADIUS_KM * MOON_MEAN_RADIUS_KM)
		);
	return new LibrationInfo(
		RAD2DEG * bdash + bdash2,
		ldash + ldash2,
		RAD2DEG * mlat,
		RAD2DEG * mlon,
		dist_km,
		diam_deg
	);
}

function rotate(rot: RotationMatrix, vec: ArrayVector): ArrayVector {
	return [
		rot.rot[0][0] * vec[0] + rot.rot[1][0] * vec[1] + rot.rot[2][0] * vec[2],
		rot.rot[0][1] * vec[0] + rot.rot[1][1] * vec[1] + rot.rot[2][1] * vec[2],
		rot.rot[0][2] * vec[0] + rot.rot[1][2] * vec[1] + rot.rot[2][2] * vec[2]
	];
}

function precession(pos: ArrayVector, time: AstroTime, dir: PrecessDirection): ArrayVector {
	const r = precession_rot(time, dir);
	return rotate(r, pos);
}

function precession_posvel(
	state: StateVector,
	time: AstroTime,
	dir: PrecessDirection
): StateVector {
	const r = precession_rot(time, dir);
	return RotateState(r, state);
}

function precession_rot(time: AstroTime, dir: PrecessDirection): RotationMatrix {
	const t = time.tt / 36525;

	let eps0 = 84381.406;

	let psia =
		((((-0.0000000951 * t + 0.000132851) * t - 0.00114045) * t - 1.0790069) * t + 5038.481507) * t;

	let omegaa =
		((((+0.0000003337 * t - 0.000000467) * t - 0.00772503) * t + 0.0512623) * t - 0.025754) * t +
		eps0;

	let chia =
		((((-0.000000056 * t + 0.000170663) * t - 0.00121197) * t - 2.3814292) * t + 10.556403) * t;

	eps0 *= ASEC2RAD;
	psia *= ASEC2RAD;
	omegaa *= ASEC2RAD;
	chia *= ASEC2RAD;

	const sa = Math.sin(eps0);
	const ca = Math.cos(eps0);
	const sb = Math.sin(-psia);
	const cb = Math.cos(-psia);
	const sc = Math.sin(-omegaa);
	const cc = Math.cos(-omegaa);
	const sd = Math.sin(chia);
	const cd = Math.cos(chia);

	const xx = cd * cb - sb * sd * cc;
	const yx = cd * sb * ca + sd * cc * cb * ca - sa * sd * sc;
	const zx = cd * sb * sa + sd * cc * cb * sa + ca * sd * sc;
	const xy = -sd * cb - sb * cd * cc;
	const yy = -sd * sb * ca + cd * cc * cb * ca - sa * cd * sc;
	const zy = -sd * sb * sa + cd * cc * cb * sa + ca * cd * sc;
	const xz = sb * sc;
	const yz = -sc * cb * ca - sa * cc;
	const zz = -sc * cb * sa + cc * ca;

	if (dir === PrecessDirection.Into2000) {
		// Perform rotation from epoch to J2000.0.
		return new RotationMatrix([
			[xx, yx, zx],
			[xy, yy, zy],
			[xz, yz, zz]
		]);
	}

	if (dir === PrecessDirection.From2000) {
		// Perform rotation from J2000.0 to epoch.
		return new RotationMatrix([
			[xx, xy, xz],
			[yx, yy, yz],
			[zx, zy, zz]
		]);
	}

	throw 'Invalid precess direction';
}

function era(time: AstroTime): number {
	// Earth Rotation Angle
	const thet1 = 0.779057273264 + 0.00273781191135448 * time.ut;
	const thet3 = time.ut % 1;
	let theta = 360 * ((thet1 + thet3) % 1);
	if (theta < 0) {
		theta += 360;
	}
	return theta;
}

interface SiderealTimeInfo {
	tt: number;
	st: number;
}

let sidereal_time_cache: SiderealTimeInfo;

function sidereal_time(time: AstroTime): number {
	// calculates Greenwich Apparent Sidereal Time (GAST)
	if (!sidereal_time_cache || sidereal_time_cache.tt !== time.tt) {
		const t = time.tt / 36525;
		let eqeq = 15 * e_tilt(time).ee; // Replace with eqeq=0 to get GMST instead of GAST (if we ever need it)
		const theta = era(time);
		const st =
			eqeq +
			0.014506 +
			((((-0.0000000368 * t - 0.000029956) * t - 0.00000044) * t + 1.3915817) * t + 4612.156534) *
				t;

		let gst = ((st / 3600 + theta) % 360) / 15;
		if (gst < 0) {
			gst += 24;
		}
		sidereal_time_cache = {
			tt: time.tt,
			st: gst
		};
	}
	return sidereal_time_cache.st; // return sidereal hours in the half-open range [0, 24).
}

/**
 * @brief Calculates Greenwich Apparent Sidereal Time (GAST).
 *
 * Given a date and time, this function calculates the rotation of the
 * Earth, represented by the equatorial angle of the Greenwich prime meridian
 * with respect to distant stars (not the Sun, which moves relative to background
 * stars by almost one degree per day).
 * This angle is called Greenwich Apparent Sidereal Time (GAST).
 * GAST is measured in sidereal hours in the half-open range [0, 24).
 * When GAST = 0, it means the prime meridian is aligned with the of-date equinox,
 * corrected at that time for precession and nutation of the Earth's axis.
 * In this context, the "equinox" is the direction in space where the Earth's
 * orbital plane (the ecliptic) intersects with the plane of the Earth's equator,
 * at the location on the Earth's orbit of the (seasonal) March equinox.
 * As the Earth rotates, GAST increases from 0 up to 24 sidereal hours,
 * then starts over at 0.
 * To convert to degrees, multiply the return value by 15.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to find GAST.
 *
 * @returns {number}
 */
export function SiderealTime(date: FlexibleDateTime): number {
	const time = MakeTime(date);
	return sidereal_time(time);
}

function inverse_terra(ovec: ArrayVector, st: number): Observer {
	// Convert from AU to kilometers
	const x = ovec[0] * KM_PER_AU;
	const y = ovec[1] * KM_PER_AU;
	const z = ovec[2] * KM_PER_AU;
	const p = Math.hypot(x, y);
	let lon_deg: number, lat_deg: number, height_km: number;
	if (p < 1.0e-6) {
		// Special case: within 1 millimeter of a pole!
		// Use arbitrary longitude, and latitude determined by polarity of z.
		lon_deg = 0;
		lat_deg = z > 0.0 ? +90 : -90;
		// Elevation is calculated directly from z.
		height_km = Math.abs(z) - EARTH_POLAR_RADIUS_KM;
	} else {
		const stlocl = Math.atan2(y, x);
		// Calculate exact longitude.
		lon_deg = RAD2DEG * stlocl - 15.0 * st;
		// Normalize longitude to the range (-180, +180].
		while (lon_deg <= -180) lon_deg += 360;
		while (lon_deg > +180) lon_deg -= 360;
		// Numerically solve for exact latitude, using Newton's Method.
		// Start with initial latitude estimate, based on a spherical Earth.
		let lat = Math.atan2(z, p);
		let cos: number, sin: number, denom: number;
		let count = 0;
		for (;;) {
			if (++count > 10) throw `inverse_terra failed to converge.`;
			// Calculate the error function W(lat).
			// We try to find the root of W, meaning where the error is 0.
			cos = Math.cos(lat);
			sin = Math.sin(lat);
			const factor = (EARTH_FLATTENING_SQUARED - 1) * EARTH_EQUATORIAL_RADIUS_KM;
			const cos2 = cos * cos;
			const sin2 = sin * sin;
			const radicand = cos2 + EARTH_FLATTENING_SQUARED * sin2;
			denom = Math.sqrt(radicand);
			const W = (factor * sin * cos) / denom - z * cos + p * sin;
			if (Math.abs(W) < 1.0e-8) break; // The error is now negligible
			// Error is still too large. Find the next estimate.
			// Calculate D = the derivative of W with respect to lat.
			const D =
				factor *
					((cos2 - sin2) / denom -
						(sin2 * cos2 * (EARTH_FLATTENING_SQUARED - 1)) / (factor * radicand)) +
				z * sin +
				p * cos;
			lat -= W / D;
		}
		// We now have a solution for the latitude in radians.
		lat_deg = RAD2DEG * lat;
		// Solve for exact height in meters.
		// There are two formulas I can use. Use whichever has the less risky denominator.
		const adjust = EARTH_EQUATORIAL_RADIUS_KM / denom;
		if (Math.abs(sin) > Math.abs(cos)) height_km = z / sin - EARTH_FLATTENING_SQUARED * adjust;
		else height_km = p / cos - adjust;
	}
	return new Observer(lat_deg, lon_deg, 1000 * height_km);
}

function terra(observer: Observer, st: number): TerraInfo {
	const phi = observer.latitude * DEG2RAD;
	const sinphi = Math.sin(phi);
	const cosphi = Math.cos(phi);
	const c = 1 / Math.hypot(cosphi, EARTH_FLATTENING * sinphi);
	const s = EARTH_FLATTENING_SQUARED * c;
	const ht_km = observer.height / 1000;
	const ach = EARTH_EQUATORIAL_RADIUS_KM * c + ht_km;
	const ash = EARTH_EQUATORIAL_RADIUS_KM * s + ht_km;
	const stlocl = (15 * st + observer.longitude) * DEG2RAD;
	const sinst = Math.sin(stlocl);
	const cosst = Math.cos(stlocl);
	return {
		pos: [
			(ach * cosphi * cosst) / KM_PER_AU,
			(ach * cosphi * sinst) / KM_PER_AU,
			(ash * sinphi) / KM_PER_AU
		],
		vel: [
			(-ANGVEL * ach * cosphi * sinst * 86400) / KM_PER_AU,
			(ANGVEL * ach * cosphi * cosst * 86400) / KM_PER_AU,
			0
		]
	};
}

function nutation(pos: ArrayVector, time: AstroTime, dir: PrecessDirection): ArrayVector {
	const r = nutation_rot(time, dir);
	return rotate(r, pos);
}

function nutation_posvel(state: StateVector, time: AstroTime, dir: PrecessDirection): StateVector {
	const r = nutation_rot(time, dir);
	return RotateState(r, state);
}

function nutation_rot(time: AstroTime, dir: PrecessDirection): RotationMatrix {
	const tilt = e_tilt(time);
	const oblm = tilt.mobl * DEG2RAD;
	const oblt = tilt.tobl * DEG2RAD;
	const psi = tilt.dpsi * ASEC2RAD;
	const cobm = Math.cos(oblm);
	const sobm = Math.sin(oblm);
	const cobt = Math.cos(oblt);
	const sobt = Math.sin(oblt);
	const cpsi = Math.cos(psi);
	const spsi = Math.sin(psi);

	const xx = cpsi;
	const yx = -spsi * cobm;
	const zx = -spsi * sobm;
	const xy = spsi * cobt;
	const yy = cpsi * cobm * cobt + sobm * sobt;
	const zy = cpsi * sobm * cobt - cobm * sobt;
	const xz = spsi * sobt;
	const yz = cpsi * cobm * sobt - sobm * cobt;
	const zz = cpsi * sobm * sobt + cobm * cobt;

	if (dir === PrecessDirection.From2000) {
		// convert J2000 to of-date
		return new RotationMatrix([
			[xx, xy, xz],
			[yx, yy, yz],
			[zx, zy, zz]
		]);
	}

	if (dir === PrecessDirection.Into2000) {
		// convert of-date to J2000
		return new RotationMatrix([
			[xx, yx, zx],
			[xy, yy, zy],
			[xz, yz, zz]
		]);
	}

	throw 'Invalid precess direction';
}

function gyration(pos: ArrayVector, time: AstroTime, dir: PrecessDirection) {
	// Combine nutation and precession into a single operation I call "gyration".
	// The order they are composed depends on the direction,
	// because both directions are mutual inverse functions.
	return dir === PrecessDirection.Into2000
		? precession(nutation(pos, time, dir), time, dir)
		: nutation(precession(pos, time, dir), time, dir);
}

function gyration_posvel(state: StateVector, time: AstroTime, dir: PrecessDirection) {
	// Combine nutation and precession into a single operation I call "gyration".
	// The order they are composed depends on the direction,
	// because both directions are mutual inverse functions.
	return dir === PrecessDirection.Into2000
		? precession_posvel(nutation_posvel(state, time, dir), time, dir)
		: nutation_posvel(precession_posvel(state, time, dir), time, dir);
}

function geo_pos(time: AstroTime, observer: Observer): ArrayVector {
	const gast = sidereal_time(time);
	const pos = terra(observer, gast).pos;
	return gyration(pos, time, PrecessDirection.Into2000);
}

/**
 * @brief A 3D Cartesian vector with a time attached to it.
 *
 * Holds the Cartesian coordinates of a vector in 3D space,
 * along with the time at which the vector is valid.
 *
 * @property {number} x        The x-coordinate expressed in astronomical units (AU).
 * @property {number} y        The y-coordinate expressed in astronomical units (AU).
 * @property {number} z        The z-coordinate expressed in astronomical units (AU).
 * @property {AstroTime} t     The time at which the vector is valid.
 */
export class Vector {
	constructor(public x: number, public y: number, public z: number, public t: AstroTime) {}

	/**
	 * Returns the length of the vector in astronomical units (AU).
	 * @returns {number}
	 */
	Length(): number {
		return Math.hypot(this.x, this.y, this.z);
	}
}

/**
 * @brief A combination of a position vector, a velocity vector, and a time.
 *
 * Holds the state vector of a body at a given time, including its position,
 * velocity, and the time they are valid.
 *
 * @property {number} x        The position x-coordinate expressed in astronomical units (AU).
 * @property {number} y        The position y-coordinate expressed in astronomical units (AU).
 * @property {number} z        The position z-coordinate expressed in astronomical units (AU).
 * @property {number} vx       The velocity x-coordinate expressed in AU/day.
 * @property {number} vy       The velocity y-coordinate expressed in AU/day.
 * @property {number} vz       The velocity z-coordinate expressed in AU/day.
 * @property {AstroTime} t     The time at which the vector is valid.
 */
export class StateVector {
	constructor(
		public x: number,
		public y: number,
		public z: number,
		public vx: number,
		public vy: number,
		public vz: number,
		public t: AstroTime
	) {}
}

/**
 * @brief Holds spherical coordinates: latitude, longitude, distance.
 *
 * Spherical coordinates represent the location of
 * a point using two angles and a distance.
 *
 * @property {number} lat       The latitude angle: -90..+90 degrees.
 * @property {number} lon       The longitude angle: 0..360 degrees.
 * @property {number} dist      Distance in AU.
 */
export class Spherical {
	lat: number;
	lon: number;
	dist: number;

	constructor(lat: number, lon: number, dist: number) {
		this.lat = VerifyNumber(lat);
		this.lon = VerifyNumber(lon);
		this.dist = VerifyNumber(dist);
	}
}

/**
 * @brief Holds right ascension, declination, and distance of a celestial object.
 *
 * @property {number} ra
 *      Right ascension in sidereal hours: [0, 24).
 *
 * @property {number} dec
 *      Declination in degrees: [-90, +90].
 *
 * @property {number} dist
 *      Distance to the celestial object expressed in
 *      <a href="https://en.wikipedia.org/wiki/Astronomical_unit">astronomical units</a> (AU).
 *
 * @property {Vector} vec
 *      The equatorial coordinates in cartesian form, using AU distance units.
 *      x = direction of the March equinox,
 *      y = direction of the June solstice,
 *      z = north.
 */
export class EquatorialCoordinates {
	ra: number;
	dec: number;
	dist: number;
	vec: Vector;

	constructor(ra: number, dec: number, dist: number, vec: Vector) {
		this.ra = VerifyNumber(ra);
		this.dec = VerifyNumber(dec);
		this.dist = VerifyNumber(dist);
		this.vec = vec;
	}
}

function IsValidRotationArray(rot: number[][]) {
	if (!(rot instanceof Array) || rot.length !== 3) return false;

	for (let i = 0; i < 3; ++i) {
		if (!(rot[i] instanceof Array) || rot[i].length !== 3) return false;

		for (let j = 0; j < 3; ++j) if (!Number.isFinite(rot[i][j])) return false;
	}

	return true;
}

type ArrayVector = [number, number, number];

interface TerraInfo {
	pos: ArrayVector;
	vel: ArrayVector;
}

/**
 * @brief Contains a rotation matrix that can be used to transform one coordinate system to another.
 *
 * @property {number[][]} rot
 *      A normalized 3x3 rotation matrix. For example, the identity matrix is represented
 *      as `[[1, 0, 0], [0, 1, 0], [0, 0, 1]]`.
 */
export class RotationMatrix {
	constructor(public rot: number[][]) {}
}

/**
 * @brief Creates a rotation matrix that can be used to transform one coordinate system to another.
 *
 * This function verifies that the `rot` parameter is of the correct format:
 * a number[3][3] array. It throws an exception if `rot` is not of that shape.
 * Otherwise it creates a new {@link RotationMatrix} object based on `rot`.
 *
 * @param {number[][]} rot
 *      An array [3][3] of numbers. Defines a rotation matrix used to premultiply
 *      a 3D vector to reorient it into another coordinate system.
 *
 * @returns {RotationMatrix}
 */
export function MakeRotation(rot: number[][]) {
	if (!IsValidRotationArray(rot)) throw 'Argument must be a [3][3] array of numbers';

	return new RotationMatrix(rot);
}

/**
 * @brief Represents the location of an object seen by an observer on the Earth.
 *
 * Holds azimuth (compass direction) and altitude (angle above/below the horizon)
 * of a celestial object as seen by an observer at a particular location on the Earth's surface.
 * Also holds right ascension and declination of the same object.
 * All of these coordinates are optionally adjusted for atmospheric refraction;
 * therefore the right ascension and declination values may not exactly match
 * those found inside a corresponding {@link EquatorialCoordinates} object.
 *
 * @property {number} azimuth
 *      A horizontal compass direction angle in degrees measured starting at north
 *      and increasing positively toward the east.
 *      The value is in the range [0, 360).
 *      North = 0, east = 90, south = 180, west = 270.
 *
 * @property {number} altitude
 *      A vertical angle in degrees above (positive) or below (negative) the horizon.
 *      The value is in the range [-90, +90].
 *      The altitude angle is optionally adjusted upward due to atmospheric refraction.
 *
 * @property {number} ra
 *      The right ascension of the celestial body in sidereal hours.
 *      The value is in the reange [0, 24).
 *      If `altitude` was adjusted for atmospheric reaction, `ra`
 *      is likewise adjusted.
 *
 * @property {number} dec
 *      The declination of of the celestial body in degrees.
 *      The value in the range [-90, +90].
 *      If `altitude` was adjusted for atmospheric reaction, `dec`
 *      is likewise adjusted.
 */
export class HorizontalCoordinates {
	azimuth: number;
	altitude: number;
	ra: number;
	dec: number;

	constructor(azimuth: number, altitude: number, ra: number, dec: number) {
		this.azimuth = VerifyNumber(azimuth);
		this.altitude = VerifyNumber(altitude);
		this.ra = VerifyNumber(ra);
		this.dec = VerifyNumber(dec);
	}
}

/**
 * @brief Ecliptic coordinates of a celestial body.
 *
 * The origin and date of the coordinate system may vary depending on the caller's usage.
 * In general, ecliptic coordinates are measured with respect to the mean plane of the Earth's
 * orbit around the Sun.
 * Includes Cartesian coordinates `(ex, ey, ez)` measured in
 * <a href="https://en.wikipedia.org/wiki/Astronomical_unit">astronomical units</a> (AU)
 * and spherical coordinates `(elon, elat)` measured in degrees.
 *
 * @property {Vector} vec
 *      Ecliptic cartesian vector with components measured in astronomical units (AU).
 *      The x-axis is within the ecliptic plane and is oriented in the direction of the
 *      <a href="https://en.wikipedia.org/wiki/Equinox_(celestial_coordinates)">equinox</a>.
 *      The y-axis is within the ecliptic plane and is oriented 90 degrees
 *      counterclockwise from the equinox, as seen from above the Sun's north pole.
 *      The z-axis is oriented perpendicular to the ecliptic plane,
 *      along the direction of the Sun's north pole.
 *
 * @property {number} elat
 *      The ecliptic latitude of the body in degrees.
 *      This is the angle north or south of the ecliptic plane.
 *      The value is in the range [-90, +90].
 *      Positive values are north and negative values are south.
 *
 * @property {number} elon
 *      The ecliptic longitude of the body in degrees.
 *      This is the angle measured counterclockwise around the ecliptic plane,
 *      as seen from above the Sun's north pole.
 *      This is the same direction that the Earth orbits around the Sun.
 *      The angle is measured starting at 0 from the equinox and increases
 *      up to 360 degrees.
 */
export class EclipticCoordinates {
	vec: Vector;
	elat: number;
	elon: number;

	constructor(vec: Vector, elat: number, elon: number) {
		this.vec = vec;
		this.elat = VerifyNumber(elat);
		this.elon = VerifyNumber(elon);
	}
}

function VectorFromArray(av: ArrayVector, time: AstroTime): Vector {
	return new Vector(av[0], av[1], av[2], time);
}

function vector2radec(pos: ArrayVector, time: AstroTime): EquatorialCoordinates {
	const vec = VectorFromArray(pos, time);
	const xyproj = vec.x * vec.x + vec.y * vec.y;
	const dist = Math.sqrt(xyproj + vec.z * vec.z);
	if (xyproj === 0) {
		if (vec.z === 0) throw 'Indeterminate sky coordinates';
		return new EquatorialCoordinates(0, vec.z < 0 ? -90 : +90, dist, vec);
	}

	let ra = RAD2HOUR * Math.atan2(vec.y, vec.x);
	if (ra < 0) ra += 24;
	const dec = RAD2DEG * Math.atan2(pos[2], Math.sqrt(xyproj));
	return new EquatorialCoordinates(ra, dec, dist, vec);
}

function spin(angle: number, pos: ArrayVector): ArrayVector {
	const angr = angle * DEG2RAD;
	const c = Math.cos(angr);
	const s = Math.sin(angr);
	return [c * pos[0] + s * pos[1], c * pos[1] - s * pos[0], pos[2]];
}

/**
 * @brief Converts equatorial coordinates to horizontal coordinates.
 *
 * Given a date and time, a geographic location of an observer on the Earth, and
 * equatorial coordinates (right ascension and declination) of a celestial body,
 * returns horizontal coordinates (azimuth and altitude angles) for that body
 * as seen by that observer. Allows optional correction for atmospheric refraction.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to find horizontal coordinates.
 *
 * @param {Observer} observer
 *      The location of the observer for which to find horizontal coordinates.
 *
 * @param {number} ra
 *      Right ascension in sidereal hours of the celestial object,
 *      referred to the mean equinox of date for the J2000 epoch.
 *
 * @param {number} dec
 *      Declination in degrees of the celestial object,
 *      referred to the mean equator of date for the J2000 epoch.
 *      Positive values are north of the celestial equator and negative values are south.
 *
 * @param {string} refraction
 *      If omitted or has a false-like value (false, null, undefined, etc.)
 *      the calculations are performed without any correction for atmospheric
 *      refraction. If the value is the string `"normal"`,
 *      uses the recommended refraction correction based on Meeus "Astronomical Algorithms"
 *      with a linear taper more than 1 degree below the horizon. The linear
 *      taper causes the refraction to linearly approach 0 as the altitude of the
 *      body approaches the nadir (-90 degrees).
 *      If the value is the string `"jplhor"`, uses a JPL Horizons
 *      compatible formula. This is the same algorithm as `"normal"`,
 *      only without linear tapering; this can result in physically impossible
 *      altitudes of less than -90 degrees, which may cause problems for some applications.
 *      (The `"jplhor"` option was created for unit testing against data
 *      generated by JPL Horizons, and is otherwise not recommended for use.)
 *
 * @returns {HorizontalCoordinates}
 */
export function Horizon(
	date: FlexibleDateTime,
	observer: Observer,
	ra: number,
	dec: number,
	refraction?: string
): HorizontalCoordinates {
	// based on NOVAS equ2hor()
	let time = MakeTime(date);
	VerifyObserver(observer);
	VerifyNumber(ra);
	VerifyNumber(dec);

	const sinlat = Math.sin(observer.latitude * DEG2RAD);
	const coslat = Math.cos(observer.latitude * DEG2RAD);
	const sinlon = Math.sin(observer.longitude * DEG2RAD);
	const coslon = Math.cos(observer.longitude * DEG2RAD);
	const sindc = Math.sin(dec * DEG2RAD);
	const cosdc = Math.cos(dec * DEG2RAD);
	const sinra = Math.sin(ra * HOUR2RAD);
	const cosra = Math.cos(ra * HOUR2RAD);

	// Calculate three mutually perpendicular unit vectors
	// in equatorial coordinates: uze, une, uwe.
	//
	// uze = The direction of the observer's local zenith (straight up).
	// une = The direction toward due north on the observer's horizon.
	// uwe = The direction toward due west on the observer's horizon.
	//
	// HOWEVER, these are uncorrected for the Earth's rotation due to the time of day.
	//
	// The components of these 3 vectors are as follows:
	// x = direction from center of Earth toward 0 degrees longitude (the prime meridian) on equator.
	// y = direction from center of Earth toward 90 degrees west longitude on equator.
	// z = direction from center of Earth toward the north pole.

	let uze: ArrayVector = [coslat * coslon, coslat * sinlon, sinlat];
	let une: ArrayVector = [-sinlat * coslon, -sinlat * sinlon, coslat];
	let uwe: ArrayVector = [sinlon, -coslon, 0];

	// Correct the vectors uze, une, uwe for the Earth's rotation by calculating
	// sidereal time. Call spin() for each uncorrected vector to rotate about
	// the Earth's axis to yield corrected unit vectors uz, un, uw.
	// Multiply sidereal hours by -15 to convert to degrees and flip eastward
	// rotation of the Earth to westward apparent movement of objects with time.

	const spin_angle = -15 * sidereal_time(time);
	let uz = spin(spin_angle, uze);
	let un = spin(spin_angle, une);
	let uw = spin(spin_angle, uwe);

	// Convert angular equatorial coordinates (RA, DEC) to
	// cartesian equatorial coordinates in 'p', using the
	// same orientation system as uze, une, uwe.

	let p = [cosdc * cosra, cosdc * sinra, sindc];

	// Use dot products of p with the zenith, north, and west
	// vectors to obtain the cartesian coordinates of the body in
	// the observer's horizontal orientation system.
	// pz = zenith component [-1, +1]
	// pn = north  component [-1, +1]
	// pw = west   component [-1, +1]

	const pz = p[0] * uz[0] + p[1] * uz[1] + p[2] * uz[2];
	const pn = p[0] * un[0] + p[1] * un[1] + p[2] * un[2];
	const pw = p[0] * uw[0] + p[1] * uw[1] + p[2] * uw[2];

	// proj is the "shadow" of the body vector along the observer's flat ground.
	let proj = Math.hypot(pn, pw);

	// Calculate az = azimuth (compass direction clockwise from East.)
	let az: number;
	if (proj > 0) {
		// If the body is not exactly straight up/down, it has an azimuth.
		// Invert the angle to produce degrees eastward from north.
		az = -RAD2DEG * Math.atan2(pw, pn);
		if (az < 0) az += 360;
	} else {
		// The body is straight up/down, so it does not have an azimuth.
		// Report an arbitrary but reasonable value.
		az = 0;
	}

	// zd = the angle of the body away from the observer's zenith, in degrees.
	let zd = RAD2DEG * Math.atan2(proj, pz);
	let out_ra = ra;
	let out_dec = dec;

	if (refraction) {
		let zd0 = zd;
		let refr = Refraction(refraction, 90 - zd);
		zd -= refr;
		if (refr > 0.0 && zd > 3.0e-4) {
			const sinzd = Math.sin(zd * DEG2RAD);
			const coszd = Math.cos(zd * DEG2RAD);
			const sinzd0 = Math.sin(zd0 * DEG2RAD);
			const coszd0 = Math.cos(zd0 * DEG2RAD);
			const pr: number[] = [];
			for (let j = 0; j < 3; ++j) {
				pr.push(((p[j] - coszd0 * uz[j]) / sinzd0) * sinzd + uz[j] * coszd);
			}
			proj = Math.hypot(pr[0], pr[1]);
			if (proj > 0) {
				out_ra = RAD2HOUR * Math.atan2(pr[1], pr[0]);
				if (out_ra < 0) {
					out_ra += 24;
				}
			} else {
				out_ra = 0;
			}
			out_dec = RAD2DEG * Math.atan2(pr[2], proj);
		}
	}

	return new HorizontalCoordinates(az, 90 - zd, out_ra, out_dec);
}

function VerifyObserver(observer: Observer): Observer {
	if (!(observer instanceof Observer)) {
		throw `Not an instance of the Observer class: ${observer}`;
	}
	VerifyNumber(observer.latitude);
	VerifyNumber(observer.longitude);
	VerifyNumber(observer.height);
	if (observer.latitude < -90 || observer.latitude > +90) {
		throw `Latitude ${observer.latitude} is out of range. Must be -90..+90.`;
	}
	return observer;
}

/**
 * @brief Represents the geographic location of an observer on the surface of the Earth.
 *
 * @property {number} latitude
 *      The observer's geographic latitude in degrees north of the Earth's equator.
 *      The value is negative for observers south of the equator.
 *      Must be in the range -90 to +90.
 *
 * @property {number} longitude
 *      The observer's geographic longitude in degrees east of the prime meridian
 *      passing through Greenwich, England.
 *      The value is negative for observers west of the prime meridian.
 *      The value should be kept in the range -180 to +180 to minimize floating point errors.
 *
 * @property {number} height
 *      The observer's elevation above mean sea level, expressed in meters.
 */
export class Observer {
	constructor(public latitude: number, public longitude: number, public height: number) {
		VerifyObserver(this);
	}
}

/**
 * @brief Returns apparent geocentric true ecliptic coordinates of date for the Sun.
 *
 * This function is used for calculating the times of equinoxes and solstices.
 *
 * <i>Geocentric</i> means coordinates as the Sun would appear to a hypothetical observer
 * at the center of the Earth.
 * <i>Ecliptic coordinates of date</i> are measured along the plane of the Earth's mean
 * orbit around the Sun, using the
 * <a href="https://en.wikipedia.org/wiki/Equinox_(celestial_coordinates)">equinox</a>
 * of the Earth as adjusted for precession and nutation of the Earth's
 * axis of rotation on the given date.
 *
 * @param {FlexibleDateTime} date
 *      The date and time at which to calculate the Sun's apparent location as seen from
 *      the center of the Earth.
 *
 * @returns {EclipticCoordinates}
 */
export function SunPosition(date: FlexibleDateTime): EclipticCoordinates {
	// Correct for light travel time from the Sun.
	// This is really the same as correcting for aberration.
	// Otherwise season calculations (equinox, solstice) will all be early by about 8 minutes!
	const time = MakeTime(date).AddDays(-1 / C_AUDAY);

	// Get heliocentric cartesian coordinates of Earth in J2000.
	const earth2000 = CalcVsop(vsop.Earth, time);

	// Convert to geocentric location of the Sun.
	const sun2000: ArrayVector = [-earth2000.x, -earth2000.y, -earth2000.z];

	// Convert to equator-of-date equatorial cartesian coordinates.
	const [gx, gy, gz] = gyration(sun2000, time, PrecessDirection.From2000);

	// Convert to ecliptic coordinates of date.
	const true_obliq = DEG2RAD * e_tilt(time).tobl;
	const cos_ob = Math.cos(true_obliq);
	const sin_ob = Math.sin(true_obliq);

	const vec = new Vector(gx, gy, gz, time);
	const sun_ecliptic = RotateEquatorialToEcliptic(vec, cos_ob, sin_ob);
	return sun_ecliptic;
}

/**
 * @brief Calculates equatorial coordinates of a Solar System body at a given time.
 *
 * Returns topocentric equatorial coordinates (right ascension and declination)
 * in one of two different systems: J2000 or true-equator-of-date.
 * Allows optional correction for aberration.
 * Always corrects for light travel time (represents the object as seen by the observer
 * with light traveling to the Earth at finite speed, not where the object is right now).
 * <i>Topocentric</i> refers to a position as seen by an observer on the surface of the Earth.
 * This function corrects for
 * <a href="https://en.wikipedia.org/wiki/Parallax">parallax</a>
 * of the object between a geocentric observer and a topocentric observer.
 * This is most significant for the Moon, because it is so close to the Earth.
 * However, it can have a small effect on the apparent positions of other bodies.
 *
 * @param {Body} body
 *      The body for which to find equatorial coordinates.
 *      Not allowed to be `Body.Earth`.
 *
 * @param {FlexibleDateTime} date
 *      Specifies the date and time at which the body is to be observed.
 *
 * @param {Observer} observer
 *      The location on the Earth of the observer.
 *
 * @param {bool} ofdate
 *      Pass `true` to return equatorial coordinates of date,
 *      i.e. corrected for precession and nutation at the given date.
 *      This is needed to get correct horizontal coordinates when you call
 *      {@link Horizon}.
 *      Pass `false` to return equatorial coordinates in the J2000 system.
 *
 * @param {bool} aberration
 *      Pass `true` to correct for
 *      <a href="https://en.wikipedia.org/wiki/Aberration_of_light">aberration</a>,
 *      or `false` to leave uncorrected.
 *
 * @returns {EquatorialCoordinates}
 *      The topocentric coordinates of the body as adjusted for the given observer.
 */
export function Equator(
	body: Body,
	date: FlexibleDateTime,
	observer: Observer,
	ofdate: boolean,
	aberration: boolean
): EquatorialCoordinates {
	VerifyObserver(observer);
	VerifyBoolean(ofdate);
	VerifyBoolean(aberration);
	const time = MakeTime(date);
	const gc_observer = geo_pos(time, observer);
	const gc = GeoVector(body, time, aberration);
	const j2000: ArrayVector = [gc.x - gc_observer[0], gc.y - gc_observer[1], gc.z - gc_observer[2]];

	if (!ofdate) return vector2radec(j2000, time);

	const datevect = gyration(j2000, time, PrecessDirection.From2000);
	return vector2radec(datevect, time);
}

/**
 * @brief Calculates geocentric equatorial coordinates of an observer on the surface of the Earth.
 *
 * This function calculates a vector from the center of the Earth to
 * a point on or near the surface of the Earth, expressed in equatorial
 * coordinates. It takes into account the rotation of the Earth at the given
 * time, along with the given latitude, longitude, and elevation of the observer.
 *
 * The caller may pass `ofdate` as `true` to return coordinates relative to the Earth's
 * equator at the specified time, or `false` to use the J2000 equator.
 *
 * The returned vector has components expressed in astronomical units (AU).
 * To convert to kilometers, multiply the `x`, `y`, and `z` values by
 * the constant value {@link KM_PER_AU}.
 *
 * The inverse of this function is also available: {@link VectorObserver}.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the observer's position vector.
 *
 * @param {Observer} observer
 *      The geographic location of a point on or near the surface of the Earth.
 *
 * @param {boolean} ofdate
 *      Selects the date of the Earth's equator in which to express the equatorial coordinates.
 *      The caller may pass `false` to use the orientation of the Earth's equator
 *      at noon UTC on January 1, 2000, in which case this function corrects for precession
 *      and nutation of the Earth as it was at the moment specified by the `time` parameter.
 *      Or the caller may pass `true` to use the Earth's equator at `time`
 *      as the orientation.
 *
 * @returns {Vector}
 *      An equatorial vector from the center of the Earth to the specified location
 *      on (or near) the Earth's surface.
 */
export function ObserverVector(
	date: FlexibleDateTime,
	observer: Observer,
	ofdate: boolean
): Vector {
	const time = MakeTime(date);
	const gast = sidereal_time(time);
	let ovec = terra(observer, gast).pos;
	if (!ofdate) ovec = gyration(ovec, time, PrecessDirection.Into2000);
	return VectorFromArray(ovec, time);
}

/**
 * @brief Calculates geocentric equatorial position and velocity of an observer on the surface of the Earth.
 *
 * This function calculates position and velocity vectors of an observer
 * on or near the surface of the Earth, expressed in equatorial
 * coordinates. It takes into account the rotation of the Earth at the given
 * time, along with the given latitude, longitude, and elevation of the observer.
 *
 * The caller may pass `ofdate` as `true` to return coordinates relative to the Earth's
 * equator at the specified time, or `false` to use the J2000 equator.
 *
 * The returned position vector has components expressed in astronomical units (AU).
 * To convert to kilometers, multiply the `x`, `y`, and `z` values by
 * the constant value {@link KM_PER_AU}.
 * The returned velocity vector has components expressed in AU/day.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the observer's position and velocity vectors.
 *
 * @param {Observer} observer
 *      The geographic location of a point on or near the surface of the Earth.
 *
 * @param {boolean} ofdate
 *      Selects the date of the Earth's equator in which to express the equatorial coordinates.
 *      The caller may pass `false` to use the orientation of the Earth's equator
 *      at noon UTC on January 1, 2000, in which case this function corrects for precession
 *      and nutation of the Earth as it was at the moment specified by the `time` parameter.
 *      Or the caller may pass `true` to use the Earth's equator at `time`
 *      as the orientation.
 *
 * @returns {StateVector}
 */
export function ObserverState(
	date: FlexibleDateTime,
	observer: Observer,
	ofdate: boolean
): StateVector {
	const time = MakeTime(date);
	const gast = sidereal_time(time);
	const svec = terra(observer, gast);
	const state = new StateVector(
		svec.pos[0],
		svec.pos[1],
		svec.pos[2],
		svec.vel[0],
		svec.vel[1],
		svec.vel[2],
		time
	);

	if (!ofdate) return gyration_posvel(state, time, PrecessDirection.Into2000);

	return state;
}

/**
 * @brief Calculates the geographic location corresponding to an equatorial vector.
 *
 * This is the inverse function of {@link ObserverVector}.
 * Given a geocentric equatorial vector, it returns the geographic
 * latitude, longitude, and elevation for that vector.
 *
 * @param {Vector} vector
 *      The geocentric equatorial position vector for which to find geographic coordinates.
 *      The components are expressed in Astronomical Units (AU).
 *      You can calculate AU by dividing kilometers by the constant {@link KM_PER_AU}.
 *      The time `vector.t` determines the Earth's rotation.
 *
 * @param {boolean} ofdate
 *      Selects the date of the Earth's equator in which `vector` is expressed.
 *      The caller may select `false` to use the orientation of the Earth's equator
 *      at noon UTC on January 1, 2000, in which case this function corrects for precession
 *      and nutation of the Earth as it was at the moment specified by `vector.t`.
 *      Or the caller may select `true` to use the Earth's equator at `vector.t`
 *      as the orientation.
 *
 * @returns {Observer}
 *      The geographic latitude, longitude, and elevation above sea level
 *      that corresponds to the given equatorial vector.
 */
export function VectorObserver(vector: Vector, ofdate: boolean): Observer {
	const gast = sidereal_time(vector.t);
	let ovec: ArrayVector = [vector.x, vector.y, vector.z];
	if (!ofdate) {
		ovec = precession(ovec, vector.t, PrecessDirection.From2000);
		ovec = nutation(ovec, vector.t, PrecessDirection.From2000);
	}
	return inverse_terra(ovec, gast);
}

/**
 * @brief Calculates the gravitational acceleration experienced by an observer on the Earth.
 *
 * This function implements the WGS 84 Ellipsoidal Gravity Formula.
 * The result is a combination of inward gravitational acceleration
 * with outward centrifugal acceleration, as experienced by an observer
 * in the Earth's rotating frame of reference.
 * The resulting value increases toward the Earth's poles and decreases
 * toward the equator, consistent with changes of the weight measured
 * by a spring scale of a fixed mass moved to different latitudes and heights
 * on the Earth.
 *
 * @param {number} latitude
 *      The latitude of the observer in degrees north or south of the equator.
 *      By formula symmetry, positive latitudes give the same answer as negative
 *      latitudes, so the sign does not matter.
 *
 * @param {number} height
 *      The height above the sea level geoid in meters.
 *      No range checking is done; however, accuracy is only valid in the
 *      range 0 to 100000 meters.
 *
 * @returns {number}
 *      The effective gravitational acceleration expressed in meters per second squared [m/s^2].
 */
export function ObserverGravity(latitude: number, height: number): number {
	const s = Math.sin(latitude * DEG2RAD);
	const s2 = s * s;
	const g0 =
		(9.7803253359 * (1.0 + 0.00193185265241 * s2)) / Math.sqrt(1.0 - 0.00669437999013 * s2);
	return g0 * (1.0 - (3.15704e-7 - 2.10269e-9 * s2) * height + 7.37452e-14 * height * height);
}

function RotateEquatorialToEcliptic(
	equ: Vector,
	cos_ob: number,
	sin_ob: number
): EclipticCoordinates {
	// Rotate equatorial vector to obtain ecliptic vector.
	const ex = equ.x;
	const ey = equ.y * cos_ob + equ.z * sin_ob;
	const ez = -equ.y * sin_ob + equ.z * cos_ob;

	const xyproj = Math.hypot(ex, ey);
	let elon = 0;
	if (xyproj > 0) {
		elon = RAD2DEG * Math.atan2(ey, ex);
		if (elon < 0) elon += 360;
	}
	let elat = RAD2DEG * Math.atan2(ez, xyproj);
	let ecl = new Vector(ex, ey, ez, equ.t);
	return new EclipticCoordinates(ecl, elat, elon);
}

/**
 * @brief Converts a J2000 mean equator (EQJ) vector to a true ecliptic of date (ETC) vector and angles.
 *
 * Given coordinates relative to the Earth's equator at J2000 (the instant of noon UTC
 * on 1 January 2000), this function converts those coordinates to true ecliptic coordinates
 * that are relative to the plane of the Earth's orbit around the Sun on that date.
 *
 * @param {Vector} eqj
 *      Equatorial coordinates in the EQJ frame of reference.
 *      You can call {@link GeoVector} to obtain suitable equatorial coordinates.
 *
 * @returns {EclipticCoordinates}
 */
export function Ecliptic(eqj: Vector): EclipticCoordinates {
	// Calculate nutation and obliquity for this time.
	// As an optimization, the nutation angles are cached in `time`,
	// and reused below when the `nutation` function is called.
	const et = e_tilt(eqj.t);

	// Convert mean J2000 equator (EQJ) to true equator of date (EQD).
	const eqj_pos: ArrayVector = [eqj.x, eqj.y, eqj.z];
	const mean_pos = precession(eqj_pos, eqj.t, PrecessDirection.From2000);
	const [x, y, z] = nutation(mean_pos, eqj.t, PrecessDirection.From2000);
	const eqd = new Vector(x, y, z, eqj.t);

	// Rotate from EQD to true ecliptic of date (ECT).
	const tobl = et.tobl * DEG2RAD;
	return RotateEquatorialToEcliptic(eqd, Math.cos(tobl), Math.sin(tobl));
}

/**
 * @brief Calculates equatorial geocentric Cartesian coordinates for the Moon.
 *
 * Given a time of observation, calculates the Moon's position as a vector.
 * The vector gives the location of the Moon's center relative to the Earth's center
 * with x-, y-, and z-components measured in astronomical units.
 * The coordinates are oriented with respect to the Earth's equator at the J2000 epoch.
 * In Astronomy Engine, this orientation is called EQJ.
 * Based on the Nautical Almanac Office's <i>Improved Lunar Ephemeris</i> of 1954,
 * which in turn derives from E. W. Brown's lunar theories.
 * Adapted from Turbo Pascal code from the book
 * <a href="https://www.springer.com/us/book/9783540672210">Astronomy on the Personal Computer</a>
 * by Montenbruck and Pfleger.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the Moon's geocentric position.
 *
 * @returns {Vector}
 */
export function GeoMoon(date: FlexibleDateTime): Vector {
	const time = MakeTime(date);
	const moon = CalcMoon(time);

	// Convert geocentric ecliptic spherical coords to cartesian coords.
	const dist_cos_lat = moon.distance_au * Math.cos(moon.geo_eclip_lat);
	const gepos: ArrayVector = [
		dist_cos_lat * Math.cos(moon.geo_eclip_lon),
		dist_cos_lat * Math.sin(moon.geo_eclip_lon),
		moon.distance_au * Math.sin(moon.geo_eclip_lat)
	];

	// Convert ecliptic coordinates to equatorial coordinates, both in mean equinox of date.
	const mpos1 = ecl2equ_vec(time, gepos);

	// Convert from mean equinox of date to J2000...
	const mpos2 = precession(mpos1, time, PrecessDirection.Into2000);

	return new Vector(mpos2[0], mpos2[1], mpos2[2], time);
}

/**
 * @brief Calculates spherical ecliptic geocentric position of the Moon.
 *
 * Given a time of observation, calculates the Moon's geocentric position
 * in ecliptic spherical coordinates. Provides the ecliptic latitude and
 * longitude in degrees, and the geocentric distance in astronomical units (AU).
 *
 * The ecliptic angles are measured in "ECT": relative to the true ecliptic plane and
 * equatorial plane at the specified time. This means the Earth's equator
 * is corrected for precession and nutation, and the plane of the Earth's
 * orbit is corrected for gradual obliquity drift.
 *
 * This algorithm is based on the Nautical Almanac Office's <i>Improved Lunar Ephemeris</i> of 1954,
 * which in turn derives from E. W. Brown's lunar theories from the early twentieth century.
 * It is adapted from Turbo Pascal code from the book
 * <a href="https://www.springer.com/us/book/9783540672210">Astronomy on the Personal Computer</a>
 * by Montenbruck and Pfleger.
 *
 * To calculate a J2000 mean equator vector instead, use {@link GeoMoon}.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the Moon's position.
 *
 * @returns {Spherical}
 */
export function EclipticGeoMoon(date: FlexibleDateTime): Spherical {
	const time = MakeTime(date);
	const moon = CalcMoon(time);

	// Convert spherical coordinates to a vector.
	// The MoonResult angles are already expressed in radians.
	const dist_cos_lat = moon.distance_au * Math.cos(moon.geo_eclip_lat);
	const ecm: ArrayVector = [
		dist_cos_lat * Math.cos(moon.geo_eclip_lon),
		dist_cos_lat * Math.sin(moon.geo_eclip_lon),
		moon.distance_au * Math.sin(moon.geo_eclip_lat)
	];

	// Obtain true and mean obliquity angles for the given time.
	// This serves to pre-calculate the nutation also, and cache it in `time`.
	const et = e_tilt(time);

	// Convert ecliptic coordinates to equatorial coordinates, both in mean equinox of date.
	const eqm = obl_ecl2equ_vec(et.mobl, ecm);

	// Add nutation to convert ECM to true equatorial coordinates of date (EQD).
	const eqd = nutation(eqm, time, PrecessDirection.From2000);
	const eqd_vec = VectorFromArray(eqd, time);

	// Convert back to ecliptic, this time in true equinox of date (ECT).
	const toblRad = et.tobl * DEG2RAD;
	const cos_tobl = Math.cos(toblRad);
	const sin_tobl = Math.sin(toblRad);
	const eclip = RotateEquatorialToEcliptic(eqd_vec, cos_tobl, sin_tobl);

	return new Spherical(eclip.elat, eclip.elon, moon.distance_au);
}

/**
 * @brief Calculates equatorial geocentric position and velocity of the Moon at a given time.
 *
 * Given a time of observation, calculates the Moon's position and velocity vectors.
 * The position and velocity are of the Moon's center relative to the Earth's center.
 * The position (x, y, z) components are expressed in AU (astronomical units).
 * The velocity (vx, vy, vz) components are expressed in AU/day.
 * The coordinates are oriented with respect to the Earth's equator at the J2000 epoch.
 * In Astronomy Engine, this orientation is called EQJ.
 * If you need the Moon's position only, and not its velocity,
 * it is much more efficient to use {@link GeoMoon} instead.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the Moon's geocentric state.
 *
 * @returns {StateVector}
 */
export function GeoMoonState(date: FlexibleDateTime): StateVector {
	const time = MakeTime(date);

	// This is a hack, because trying to figure out how to derive a time
	// derivative for CalcMoon() would be extremely painful!
	// Calculate just before and just after the given time.
	// Average to find position, subtract to find velocity.
	const dt = 1.0e-5; // 0.864 seconds

	const t1 = time.AddDays(-dt);
	const t2 = time.AddDays(+dt);
	const r1 = GeoMoon(t1);
	const r2 = GeoMoon(t2);

	return new StateVector(
		(r1.x + r2.x) / 2,
		(r1.y + r2.y) / 2,
		(r1.z + r2.z) / 2,
		(r2.x - r1.x) / (2 * dt),
		(r2.y - r1.y) / (2 * dt),
		(r2.z - r1.z) / (2 * dt),
		time
	);
}

/**
 * @brief Calculates the geocentric position and velocity of the Earth/Moon barycenter.
 *
 * Given a time of observation, calculates the geocentric position and velocity vectors
 * of the Earth/Moon barycenter (EMB).
 * The position (x, y, z) components are expressed in AU (astronomical units).
 * The velocity (vx, vy, vz) components are expressed in AU/day.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the EMB's geocentric state.
 *
 * @returns {StateVector}
 */
export function GeoEmbState(date: FlexibleDateTime): StateVector {
	const time = MakeTime(date);
	const s = GeoMoonState(time);
	const d = 1.0 + EARTH_MOON_MASS_RATIO;
	return new StateVector(s.x / d, s.y / d, s.z / d, s.vx / d, s.vy / d, s.vz / d, time);
}

function VsopFormula(formula: any, t: number, clamp_angle: boolean): number {
	let tpower = 1;
	let coord = 0;
	for (let series of formula) {
		let sum = 0;
		for (let [ampl, phas, freq] of series) sum += ampl * Math.cos(phas + t * freq);
		let incr = tpower * sum;
		if (clamp_angle) incr %= PI2; // improve precision for longitudes: they can be hundreds of radians
		coord += incr;
		tpower *= t;
	}
	return coord;
}

function VsopDeriv(formula: any, t: number) {
	let tpower = 1; // t^s
	let dpower = 0; // t^(s-1)
	let deriv = 0;
	let s = 0;
	for (let series of formula) {
		let sin_sum = 0;
		let cos_sum = 0;
		for (let [ampl, phas, freq] of series) {
			let angle = phas + t * freq;
			sin_sum += ampl * freq * Math.sin(angle);
			if (s > 0) cos_sum += ampl * Math.cos(angle);
		}
		deriv += s * dpower * cos_sum - tpower * sin_sum;
		dpower = tpower;
		tpower *= t;
		++s;
	}
	return deriv;
}

const DAYS_PER_MILLENNIUM = 365250;
const LON_INDEX = 0;
const LAT_INDEX = 1;
const RAD_INDEX = 2;

function VsopRotate(eclip: ArrayVector): TerseVector {
	// Convert ecliptic cartesian coordinates to equatorial cartesian coordinates.
	return new TerseVector(
		eclip[0] + 0.00000044036 * eclip[1] - 0.000000190919 * eclip[2],
		-0.000000479966 * eclip[0] + 0.917482137087 * eclip[1] - 0.397776982902 * eclip[2],
		0.397776982902 * eclip[1] + 0.917482137087 * eclip[2]
	);
}

function VsopSphereToRect(lon: number, lat: number, radius: number): ArrayVector {
	// Convert spherical coordinates to ecliptic cartesian coordinates.
	const r_coslat = radius * Math.cos(lat);
	const coslon = Math.cos(lon);
	const sinlon = Math.sin(lon);
	return [r_coslat * coslon, r_coslat * sinlon, radius * Math.sin(lat)];
}

function CalcVsop(model: VsopModel, time: AstroTime): Vector {
	const t = time.tt / DAYS_PER_MILLENNIUM; // millennia since 2000
	const lon = VsopFormula(model[LON_INDEX], t, true);
	const lat = VsopFormula(model[LAT_INDEX], t, false);
	const rad = VsopFormula(model[RAD_INDEX], t, false);
	const eclip = VsopSphereToRect(lon, lat, rad);
	return VsopRotate(eclip).ToAstroVector(time);
}

function CalcVsopPosVel(model: VsopModel, tt: number): body_state_t {
	const t = tt / DAYS_PER_MILLENNIUM;

	// Calculate the VSOP "B" trigonometric series to obtain ecliptic spherical coordinates.
	const lon = VsopFormula(model[LON_INDEX], t, true);
	const lat = VsopFormula(model[LAT_INDEX], t, false);
	const rad = VsopFormula(model[RAD_INDEX], t, false);

	const dlon_dt = VsopDeriv(model[LON_INDEX], t);
	const dlat_dt = VsopDeriv(model[LAT_INDEX], t);
	const drad_dt = VsopDeriv(model[RAD_INDEX], t);

	// Use spherical coords and spherical derivatives to calculate
	// the velocity vector in rectangular coordinates.

	const coslon = Math.cos(lon);
	const sinlon = Math.sin(lon);
	const coslat = Math.cos(lat);
	const sinlat = Math.sin(lat);

	const vx =
		+(drad_dt * coslat * coslon) -
		rad * sinlat * coslon * dlat_dt -
		rad * coslat * sinlon * dlon_dt;

	const vy =
		+(drad_dt * coslat * sinlon) -
		rad * sinlat * sinlon * dlat_dt +
		rad * coslat * coslon * dlon_dt;

	const vz = +(drad_dt * sinlat) + rad * coslat * dlat_dt;

	const eclip_pos = VsopSphereToRect(lon, lat, rad);

	// Convert speed units from [AU/millennium] to [AU/day].
	const eclip_vel: ArrayVector = [
		vx / DAYS_PER_MILLENNIUM,
		vy / DAYS_PER_MILLENNIUM,
		vz / DAYS_PER_MILLENNIUM
	];

	// Rotate the vectors from ecliptic to equatorial coordinates.
	const equ_pos = VsopRotate(eclip_pos);
	const equ_vel = VsopRotate(eclip_vel);
	return new body_state_t(tt, equ_pos, equ_vel);
}

function AdjustBarycenter(ssb: Vector, time: AstroTime, body: Body, pmass: number): void {
	const shift = pmass / (pmass + SUN_GM);
	const planet = CalcVsop(vsop[body], time);
	ssb.x += shift * planet.x;
	ssb.y += shift * planet.y;
	ssb.z += shift * planet.z;
}

function CalcSolarSystemBarycenter(time: AstroTime): Vector {
	const ssb = new Vector(0.0, 0.0, 0.0, time);
	AdjustBarycenter(ssb, time, Body.Jupiter, JUPITER_GM);
	AdjustBarycenter(ssb, time, Body.Saturn, SATURN_GM);
	AdjustBarycenter(ssb, time, Body.Uranus, URANUS_GM);
	AdjustBarycenter(ssb, time, Body.Neptune, NEPTUNE_GM);
	return ssb;
}

// Pluto integrator begins ----------------------------------------------------

const PLUTO_NUM_STATES = 51;
const PLUTO_TIME_STEP = 29200;
const PLUTO_DT = 146;
const PLUTO_NSTEPS = 201;

const PlutoStateTable: BodyStateTableEntry[] = [
	[
		-730000.0,
		[-26.118207232108, -14.376168177825, 3.384402515299],
		[1.6339372163656e-3, -2.7861699588508e-3, -1.3585880229445e-3]
	],
	[
		-700800.0,
		[41.974905202127, -0.448502952929, -12.770351505989],
		[7.3458569351457e-4, 2.2785014891658e-3, 4.8619778602049e-4]
	],
	[
		-671600.0,
		[14.706930780744, 44.269110540027, 9.353698474772],
		[-2.10001479998e-3, 2.2295915939915e-4, 7.0143443551414e-4]
	],
	[
		-642400.0,
		[-29.441003929957, -6.43016153057, 6.858481011305],
		[8.4495803960544e-4, -3.0783914758711e-3, -1.2106305981192e-3]
	],
	[
		-613200.0,
		[39.444396946234, -6.557989760571, -13.913760296463],
		[1.1480029005873e-3, 2.2400006880665e-3, 3.5168075922288e-4]
	],
	[
		-584000.0,
		[20.2303809507, 43.266966657189, 7.382966091923],
		[-1.9754081700585e-3, 5.3457141292226e-4, 7.5929169129793e-4]
	],
	[
		-554800.0,
		[-30.65832536462, 2.093818874552, 9.880531138071],
		[6.1010603013347e-5, -3.1326500935382e-3, -9.9346125151067e-4]
	],
	[
		-525600.0,
		[35.737703251673, -12.587706024764, -14.677847247563],
		[1.5802939375649e-3, 2.1347678412429e-3, 1.9074436384343e-4]
	],
	[
		-496400.0,
		[25.466295188546, 41.367478338417, 5.216476873382],
		[-1.8054401046468e-3, 8.328308359951e-4, 8.0260156912107e-4]
	],
	[
		-467200.0,
		[-29.847174904071, 10.636426313081, 12.297904180106],
		[-6.3257063052907e-4, -2.9969577578221e-3, -7.4476074151596e-4]
	],
	[
		-438000.0,
		[30.774692107687, -18.236637015304, -14.945535879896],
		[2.0113162005465e-3, 1.9353827024189e-3, -2.0937793168297e-6]
	],
	[
		-408800.0,
		[30.243153324028, 38.656267888503, 2.938501750218],
		[-1.6052508674468e-3, 1.1183495337525e-3, 8.3333973416824e-4]
	],
	[
		-379600.0,
		[-27.288984772533, 18.643162147874, 14.023633623329],
		[-1.1856388898191e-3, -2.7170609282181e-3, -4.9015526126399e-4]
	],
	[
		-350400.0,
		[24.519605196774, -23.245756064727, -14.626862367368],
		[2.4322321483154e-3, 1.6062008146048e-3, -2.3369181613312e-4]
	],
	[
		-321200.0,
		[34.505274805875, 35.125338586954, 0.557361475637],
		[-1.3824391637782e-3, 1.3833397561817e-3, 8.4823598806262e-4]
	],
	[
		-292000.0,
		[-23.275363915119, 25.818514298769, 15.055381588598],
		[-1.6062295460975e-3, -2.3395961498533e-3, -2.4377362639479e-4]
	],
	[
		-262800.0,
		[17.050384798092, -27.180376290126, -13.608963321694],
		[2.8175521080578e-3, 1.1358749093955e-3, -4.9548725258825e-4]
	],
	[
		-233600.0,
		[38.093671910285, 30.880588383337, -1.843688067413],
		[-1.1317697153459e-3, 1.6128814698472e-3, 8.4177586176055e-4]
	],
	[
		-204400.0,
		[-18.197852930878, 31.932869934309, 15.438294826279],
		[-1.9117272501813e-3, -1.9146495909842e-3, -1.9657304369835e-5]
	],
	[
		-175200.0,
		[8.528924039997, -29.618422200048, -11.805400994258],
		[3.1034370787005e-3, 5.139363329243e-4, -7.7293066202546e-4]
	],
	[
		-146000.0,
		[40.94685725864, 25.904973592021, -4.256336240499],
		[-8.3652705194051e-4, 1.8129497136404e-3, 8.156422827306e-4]
	],
	[
		-116800.0,
		[-12.326958895325, 36.881883446292, 15.217158258711],
		[-2.1166103705038e-3, -1.481442003599e-3, 1.7401209844705e-4]
	],
	[
		-87600.0,
		[-0.633258375909, -30.018759794709, -9.17193287495],
		[3.2016994581737e-3, -2.5279858672148e-4, -1.0411088271861e-3]
	],
	[
		-58400.0,
		[42.936048423883, 20.344685584452, -6.588027007912],
		[-5.0525450073192e-4, 1.9910074335507e-3, 7.7440196540269e-4]
	],
	[
		-29200.0,
		[-5.975910552974, 40.61180995846, 14.470131723673],
		[-2.2184202156107e-3, -1.0562361130164e-3, 3.3652250216211e-4]
	],
	[
		0.0,
		[-9.875369580774, -27.978926224737, -5.753711824704],
		[3.0287533248818e-3, -1.1276087003636e-3, -1.2651326732361e-3]
	],
	[
		29200.0,
		[43.958831986165, 14.214147973292, -8.808306227163],
		[-1.4717608981871e-4, 2.1404187242141e-3, 7.1486567806614e-4]
	],
	[
		58400.0,
		[0.67813676352, 43.094461639362, 13.243238780721],
		[-2.2358226110718e-3, -6.3233636090933e-4, 4.7664798895648e-4]
	],
	[
		87600.0,
		[-18.282602096834, -23.30503958666, -1.766620508028],
		[2.5567245263557e-3, -1.9902940754171e-3, -1.3943491701082e-3]
	],
	[
		116800.0,
		[43.873338744526, 7.700705617215, -10.814273666425],
		[2.3174803055677e-4, 2.2402163127924e-3, 6.2988756452032e-4]
	],
	[
		146000.0,
		[7.392949027906, 44.382678951534, 11.629500214854],
		[-2.193281545383e-3, -2.1751799585364e-4, 5.9556516201114e-4]
	],
	[
		175200.0,
		[-24.981690229261, -16.204012851426, 2.466457544298],
		[1.819398914958e-3, -2.6765419531201e-3, -1.3848283502247e-3]
	],
	[
		204400.0,
		[42.530187039511, 0.845935508021, -12.554907527683],
		[6.5059779150669e-4, 2.2725657282262e-3, 5.1133743202822e-4]
	],
	[
		233600.0,
		[13.999526486822, 44.462363044894, 9.669418486465],
		[-2.1079296569252e-3, 1.7533423831993e-4, 6.9128485798076e-4]
	],
	[
		262800.0,
		[-29.184024803031, -7.371243995762, 6.493275957928],
		[9.3581363109681e-4, -3.0610357109184e-3, -1.2364201089345e-3]
	],
	[
		292000.0,
		[39.831980671753, -6.078405766765, -13.909815358656],
		[1.1117769689167e-3, 2.2362097830152e-3, 3.6230548231153e-4]
	],
	[
		321200.0,
		[20.294955108476, 43.417190420251, 7.450091985932],
		[-1.9742157451535e-3, 5.3102050468554e-4, 7.5938408813008e-4]
	],
	[
		350400.0,
		[-30.66999230216, 2.318743558955, 9.973480913858],
		[4.5605107450676e-5, -3.1308219926928e-3, -9.9066533301924e-4]
	],
	[
		379600.0,
		[35.626122155983, -12.897647509224, -14.777586508444],
		[1.6015684949743e-3, 2.1171931182284e-3, 1.8002516202204e-4]
	],
	[
		408800.0,
		[26.133186148561, 41.232139187599, 5.00640132622],
		[-1.7857704419579e-3, 8.6046232702817e-4, 8.0614690298954e-4]
	],
	[
		438000.0,
		[-29.57674022923, 11.863535943587, 12.631323039872],
		[-7.2292830060955e-4, -2.9587820140709e-3, -7.08242964503e-4]
	],
	[
		467200.0,
		[29.910805787391, -19.159019294, -15.013363865194],
		[2.0871080437997e-3, 1.8848372554514e-3, -3.8528655083926e-5]
	],
	[
		496400.0,
		[31.375957451819, 38.050372720763, 2.433138343754],
		[-1.5546055556611e-3, 1.1699815465629e-3, 8.3565439266001e-4]
	],
	[
		525600.0,
		[-26.360071336928, 20.662505904952, 14.414696258958],
		[-1.3142373118349e-3, -2.6236647854842e-3, -4.2542017598193e-4]
	],
	[
		554800.0,
		[22.599441488648, -24.508879898306, -14.484045731468],
		[2.5454108304806e-3, 1.4917058755191e-3, -3.0243665086079e-4]
	],
	[
		584000.0,
		[35.877864013014, 33.894226366071, -0.224524636277],
		[-1.2941245730845e-3, 1.4560427668319e-3, 8.4762160640137e-4]
	],
	[
		613200.0,
		[-21.538149762417, 28.204068269761, 15.321973799534],
		[-1.731211740901e-3, -2.1939631314577e-3, -1.631691327518e-4]
	],
	[
		642400.0,
		[13.971521374415, -28.339941764789, -13.083792871886],
		[2.9334630526035e-3, 9.1860931752944e-4, -5.9939422488627e-4]
	],
	[
		671600.0,
		[39.526942044143, 28.93989736011, -2.872799527539],
		[-1.0068481658095e-3, 1.702113288809e-3, 8.3578230511981e-4]
	],
	[
		700800.0,
		[-15.576200701394, 34.399412961275, 15.466033737854],
		[-2.0098814612884e-3, -1.7191109825989e-3, 7.0414782780416e-5]
	],
	[
		730000.0,
		[4.24325283709, -30.118201690825, -10.707441231349],
		[3.1725847067411e-3, 1.609846120227e-4, -9.0672150593868e-4]
	]
];

class TerseVector {
	constructor(public x: number, public y: number, public z: number) {}

	clone(): TerseVector {
		return new TerseVector(this.x, this.y, this.z);
	}

	ToAstroVector(t: AstroTime) {
		return new Vector(this.x, this.y, this.z, t);
	}

	public static zero(): TerseVector {
		return new TerseVector(0, 0, 0);
	}

	quadrature() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	add(other: TerseVector): TerseVector {
		return new TerseVector(this.x + other.x, this.y + other.y, this.z + other.z);
	}

	sub(other: TerseVector): TerseVector {
		return new TerseVector(this.x - other.x, this.y - other.y, this.z - other.z);
	}

	incr(other: TerseVector) {
		this.x += other.x;
		this.y += other.y;
		this.z += other.z;
	}

	decr(other: TerseVector) {
		this.x -= other.x;
		this.y -= other.y;
		this.z -= other.z;
	}

	mul(scalar: number): TerseVector {
		return new TerseVector(scalar * this.x, scalar * this.y, scalar * this.z);
	}

	div(scalar: number): TerseVector {
		return new TerseVector(this.x / scalar, this.y / scalar, this.z / scalar);
	}

	mean(other: TerseVector): TerseVector {
		return new TerseVector((this.x + other.x) / 2, (this.y + other.y) / 2, (this.z + other.z) / 2);
	}

	neg(): TerseVector {
		return new TerseVector(-this.x, -this.y, -this.z);
	}
}

class body_state_t {
	constructor(public tt: number, public r: TerseVector, public v: TerseVector) {}

	clone(): body_state_t {
		return new body_state_t(this.tt, this.r, this.v);
	}

	sub(other: body_state_t): body_state_t {
		return new body_state_t(this.tt, this.r.sub(other.r), this.v.sub(other.v));
	}
}

type BodyStateTableEntry = [number, ArrayVector, ArrayVector];

function BodyStateFromTable(entry: BodyStateTableEntry): body_state_t {
	let [tt, [rx, ry, rz], [vx, vy, vz]] = entry;
	return new body_state_t(tt, new TerseVector(rx, ry, rz), new TerseVector(vx, vy, vz));
}

function AdjustBarycenterPosVel(
	ssb: body_state_t,
	tt: number,
	body: Body,
	planet_gm: number
): body_state_t {
	const shift = planet_gm / (planet_gm + SUN_GM);
	const planet = CalcVsopPosVel(vsop[body], tt);
	ssb.r.incr(planet.r.mul(shift));
	ssb.v.incr(planet.v.mul(shift));
	return planet;
}

function AccelerationIncrement(
	small_pos: TerseVector,
	gm: number,
	major_pos: TerseVector
): TerseVector {
	const delta = major_pos.sub(small_pos);
	const r2 = delta.quadrature();
	return delta.mul(gm / (r2 * Math.sqrt(r2)));
}

class major_bodies_t {
	Jupiter: body_state_t;
	Saturn: body_state_t;
	Uranus: body_state_t;
	Neptune: body_state_t;
	Sun: body_state_t;

	constructor(tt: number) {
		// Accumulate the Solar System Barycenter position.

		let ssb = new body_state_t(tt, new TerseVector(0, 0, 0), new TerseVector(0, 0, 0));

		this.Jupiter = AdjustBarycenterPosVel(ssb, tt, Body.Jupiter, JUPITER_GM);
		this.Saturn = AdjustBarycenterPosVel(ssb, tt, Body.Saturn, SATURN_GM);
		this.Uranus = AdjustBarycenterPosVel(ssb, tt, Body.Uranus, URANUS_GM);
		this.Neptune = AdjustBarycenterPosVel(ssb, tt, Body.Neptune, NEPTUNE_GM);

		// Convert planets' [pos, vel] vectors from heliocentric to barycentric.

		this.Jupiter.r.decr(ssb.r);
		this.Jupiter.v.decr(ssb.v);

		this.Saturn.r.decr(ssb.r);
		this.Saturn.v.decr(ssb.v);

		this.Uranus.r.decr(ssb.r);
		this.Uranus.v.decr(ssb.v);

		this.Neptune.r.decr(ssb.r);
		this.Neptune.v.decr(ssb.v);

		// Convert heliocentric SSB to barycentric Sun.
		this.Sun = new body_state_t(tt, ssb.r.mul(-1), ssb.v.mul(-1));
	}

	Acceleration(pos: TerseVector): TerseVector {
		// Use barycentric coordinates of the Sun and major planets to calculate
		// the gravitational acceleration vector experienced at location 'pos'.
		let acc = AccelerationIncrement(pos, SUN_GM, this.Sun.r);
		acc.incr(AccelerationIncrement(pos, JUPITER_GM, this.Jupiter.r));
		acc.incr(AccelerationIncrement(pos, SATURN_GM, this.Saturn.r));
		acc.incr(AccelerationIncrement(pos, URANUS_GM, this.Uranus.r));
		acc.incr(AccelerationIncrement(pos, NEPTUNE_GM, this.Neptune.r));
		return acc;
	}
}

/**
 * @ignore
 *
 * @brief The state of a body at an incremental step in a gravity simulation.
 *
 * This is an internal data structure used to represent the
 * position, velocity, and acceleration vectors of a body
 * in a gravity simulation at a given moment in time.
 *
 * @property tt
 *      The J2000 terrestrial time of the state [days].
 *
 * @property r
 *      The position vector [au].
 *
 * @property v
 *      The velocity vector [au/day].
 *
 * @property a
 *      The acceleration vector [au/day^2].
 */
class body_grav_calc_t {
	constructor(
		public tt: number,
		public r: TerseVector,
		public v: TerseVector,
		public a: TerseVector
	) {}

	clone(): body_grav_calc_t {
		return new body_grav_calc_t(this.tt, this.r.clone(), this.v.clone(), this.a.clone());
	}
}

class grav_sim_t {
	constructor(public bary: major_bodies_t, public grav: body_grav_calc_t) {}
}

function UpdatePosition(dt: number, r: TerseVector, v: TerseVector, a: TerseVector): TerseVector {
	return new TerseVector(
		r.x + dt * (v.x + (dt * a.x) / 2),
		r.y + dt * (v.y + (dt * a.y) / 2),
		r.z + dt * (v.z + (dt * a.z) / 2)
	);
}

function UpdateVelocity(dt: number, v: TerseVector, a: TerseVector): TerseVector {
	return new TerseVector(v.x + dt * a.x, v.y + dt * a.y, v.z + dt * a.z);
}

function GravSim(tt2: number, calc1: body_grav_calc_t): grav_sim_t {
	const dt = tt2 - calc1.tt;

	// Calculate where the major bodies (Sun, Jupiter...Neptune) will be at tt2.
	const bary2 = new major_bodies_t(tt2);

	// Estimate position of small body as if current acceleration applies across the whole time interval.
	const approx_pos = UpdatePosition(dt, calc1.r, calc1.v, calc1.a);

	// Calculate the average acceleration of the endpoints.
	// This becomes our estimate of the mean effective acceleration over the whole interval.
	const mean_acc = bary2.Acceleration(approx_pos).mean(calc1.a);

	// Refine the estimates of [pos, vel, acc] at tt2 using the mean acceleration.
	const pos = UpdatePosition(dt, calc1.r, calc1.v, mean_acc);
	const vel = calc1.v.add(mean_acc.mul(dt));
	const acc = bary2.Acceleration(pos);
	const grav = new body_grav_calc_t(tt2, pos, vel, acc);
	return new grav_sim_t(bary2, grav);
}

const pluto_cache: body_grav_calc_t[][] = [];

function ClampIndex(frac: number, nsteps: number) {
	const index = Math.floor(frac);
	if (index < 0) return 0;
	if (index >= nsteps) return nsteps - 1;
	return index;
}

function GravFromState(entry: BodyStateTableEntry) {
	const state = BodyStateFromTable(entry);
	const bary = new major_bodies_t(state.tt);
	const r = state.r.add(bary.Sun.r);
	const v = state.v.add(bary.Sun.v);
	const a = bary.Acceleration(r);
	const grav = new body_grav_calc_t(state.tt, r, v, a);
	return new grav_sim_t(bary, grav);
}

function GetSegment(cache: body_grav_calc_t[][], tt: number): body_grav_calc_t[] | null {
	const t0: number = PlutoStateTable[0][0];

	if (tt < t0 || tt > PlutoStateTable[PLUTO_NUM_STATES - 1][0]) {
		// Don't bother calculating a segment. Let the caller crawl backward/forward to this time.
		return null;
	}

	const seg_index = ClampIndex((tt - t0) / PLUTO_TIME_STEP, PLUTO_NUM_STATES - 1);
	if (!cache[seg_index]) {
		const seg: body_grav_calc_t[] = (cache[seg_index] = []);

		// Each endpoint is exact.
		seg[0] = GravFromState(PlutoStateTable[seg_index]).grav;
		seg[PLUTO_NSTEPS - 1] = GravFromState(PlutoStateTable[seg_index + 1]).grav;

		// Simulate forwards from the lower time bound.
		let i: number;
		let step_tt = seg[0].tt;
		for (i = 1; i < PLUTO_NSTEPS - 1; ++i) seg[i] = GravSim((step_tt += PLUTO_DT), seg[i - 1]).grav;

		// Simulate backwards from the upper time bound.
		step_tt = seg[PLUTO_NSTEPS - 1].tt;
		var reverse = [];
		reverse[PLUTO_NSTEPS - 1] = seg[PLUTO_NSTEPS - 1];
		for (i = PLUTO_NSTEPS - 2; i > 0; --i)
			reverse[i] = GravSim((step_tt -= PLUTO_DT), reverse[i + 1]).grav;

		// Fade-mix the two series so that there are no discontinuities.
		for (i = PLUTO_NSTEPS - 2; i > 0; --i) {
			const ramp = i / (PLUTO_NSTEPS - 1);
			seg[i].r = seg[i].r.mul(1 - ramp).add(reverse[i].r.mul(ramp));
			seg[i].v = seg[i].v.mul(1 - ramp).add(reverse[i].v.mul(ramp));
			seg[i].a = seg[i].a.mul(1 - ramp).add(reverse[i].a.mul(ramp));
		}
	}

	return cache[seg_index];
}

function CalcPlutoOneWay(entry: BodyStateTableEntry, target_tt: number, dt: number): grav_sim_t {
	let sim = GravFromState(entry);
	const n = Math.ceil((target_tt - sim.grav.tt) / dt);
	for (let i = 0; i < n; ++i) sim = GravSim(i + 1 === n ? target_tt : sim.grav.tt + dt, sim.grav);
	return sim;
}

function CalcPluto(time: AstroTime, helio: boolean): StateVector {
	let r, v, bary;
	const seg = GetSegment(pluto_cache, time.tt);
	if (!seg) {
		// The target time is outside the year range 0000..4000.
		// Calculate it by crawling backward from 0000 or forward from 4000.
		// FIXFIXFIX - This is super slow. Could optimize this with extra caching if needed.
		let sim;
		if (time.tt < PlutoStateTable[0][0])
			sim = CalcPlutoOneWay(PlutoStateTable[0], time.tt, -PLUTO_DT);
		else sim = CalcPlutoOneWay(PlutoStateTable[PLUTO_NUM_STATES - 1], time.tt, +PLUTO_DT);
		r = sim.grav.r;
		v = sim.grav.v;
		bary = sim.bary;
	} else {
		const left = ClampIndex((time.tt - seg[0].tt) / PLUTO_DT, PLUTO_NSTEPS - 1);
		const s1 = seg[left];
		const s2 = seg[left + 1];

		// Find mean acceleration vector over the interval.
		const acc = s1.a.mean(s2.a);

		// Use Newtonian mechanics to extrapolate away from t1 in the positive time direction.
		const ra = UpdatePosition(time.tt - s1.tt, s1.r, s1.v, acc);
		const va = UpdateVelocity(time.tt - s1.tt, s1.v, acc);

		// Use Newtonian mechanics to extrapolate away from t2 in the negative time direction.
		const rb = UpdatePosition(time.tt - s2.tt, s2.r, s2.v, acc);
		const vb = UpdateVelocity(time.tt - s2.tt, s2.v, acc);

		// Use fade in/out idea to blend the two position estimates.
		const ramp = (time.tt - s1.tt) / PLUTO_DT;
		r = ra.mul(1 - ramp).add(rb.mul(ramp));
		v = va.mul(1 - ramp).add(vb.mul(ramp));
	}

	if (helio) {
		// Convert barycentric vectors to heliocentric vectors.
		if (!bary) bary = new major_bodies_t(time.tt);
		r = r.sub(bary.Sun.r);
		v = v.sub(bary.Sun.v);
	}

	return new StateVector(r.x, r.y, r.z, v.x, v.y, v.z, time);
}

// Pluto integrator ends -----------------------------------------------------

// Jupiter Moons begins ------------------------------------------------------

type jm_term_t = [number, number, number]; // amplitude, phase, frequency
type jm_series_t = jm_term_t[];

interface jupiter_moon_t {
	mu: number;
	al: [number, number];
	a: jm_series_t;
	l: jm_series_t;
	z: jm_series_t;
	zeta: jm_series_t;
}

const Rotation_JUP_EQJ = new RotationMatrix([
	[9.99432765338654e-1, -3.36771074697641e-2, 0.0],
	[3.03959428906285e-2, 9.02057912352809e-1, 4.30543388542295e-1],
	[-1.44994559663353e-2, -4.30299169409101e-1, 9.02569881273754e-1]
]);

const JupiterMoonModel: jupiter_moon_t[] = [
	// [0] Io
	{
		mu: 2.8248942843381399e-7,
		al: [1.4462132960212239, 3.5515522861824],
		a: [[0.0028210960212903, 0.0, 0.0]],
		l: [
			[-0.0001925258348666, 4.9369589722644998, 1.358483658305e-2],
			[-0.0000970803596076, 4.3188796477322002, 1.303413843243e-2],
			[-0.00008988174165, 1.9080016428616999, 3.0506486715799999e-3],
			[-0.0000553101050262, 1.4936156681568999, 1.2938928911549999e-2]
		],
		z: [
			[0.0041510849668155, 4.089939635545, -1.2906864146660001e-2],
			[0.0006260521444113, 1.446188898627, 3.5515522949801999],
			[0.0000352747346169, 2.1256287034577999, 1.2727416566999999e-4]
		],
		zeta: [
			[0.0003142172466014, 2.7964219722923001, -2.315096098e-3],
			[0.0000904169207946, 1.0477061879627001, -5.6920638196000003e-4]
		]
	},

	// [1] Europa
	{
		mu: 2.8248327439289299e-7,
		al: [-3.7352634374713622e-1, 1.7693227111234699],
		a: [
			[0.0044871037804314, 0.0, 0.0],
			[0.0000004324367498, 1.819645606291, 1.7822295777568]
		],
		l: [
			[0.0008576433172936, 4.3188693178264002, 1.3034138308049999e-2],
			[0.0004549582875086, 1.4936531751079001, 1.2938928819619999e-2],
			[0.0003248939825174, 1.8196494533458001, 1.7822295777568],
			[-0.0003074250079334, 4.9377037005910998, 1.358483286724e-2],
			[0.0001982386144784, 1.9079869054759999, 3.0510121286900001e-3],
			[0.0001834063551804, 2.1402853388529, 1.45009789338e-3],
			[-0.0001434383188452, 5.6222140366630002, 8.9111478887838003e-1],
			[-0.0000771939140944, 4.3002724372349999, 2.6733443704265998]
		],
		z: [
			[-0.0093589104136341, 4.0899396509038999, -1.2906864146660001e-2],
			[0.0002988994545555, 5.9097265185595003, 1.7693227079461999],
			[0.000213903639035, 2.1256289300016, 1.2727418406999999e-4],
			[0.0001980963564781, 2.7435168292649998, 6.7797343008999997e-4],
			[0.0001210388158965, 5.5839943711203004, 3.2056614899999997e-5],
			[0.0000837042048393, 1.6094538368039, -9.0402165808846002e-1],
			[0.0000823525166369, 1.4461887708689001, 3.5515522949801999]
		],
		zeta: [
			[0.0040404917832303, 1.0477063169425, -5.6920640539999997e-4],
			[0.0002200421034564, 3.3368857864364001, -1.2491307306999999e-4],
			[0.0001662544744719, 2.4134862374710999, 0.0],
			[0.0000590282470983, 5.9719930968366004, -3.056160225e-5]
		]
	},

	// [2] Ganymede
	{
		mu: 2.8249818418472298e-7,
		al: [2.8740893911433479e-1, 8.7820792358932798e-1],
		a: [
			[0.0071566594572575, 0.0, 0.0],
			[0.000001393029911, 1.1586745884981, 2.6733443704265998]
		],
		l: [
			[0.0002310797886226, 2.1402987195941998, 1.4500978438400001e-3],
			[-0.0001828635964118, 4.3188672736968003, 1.303413828263e-2],
			[0.0001512378778204, 4.9373102372298003, 1.358483481252e-2],
			[-0.0001163720969778, 4.3002659861490002, 2.6733443704265998],
			[-0.0000955478069846, 1.4936612842567001, 1.2938928798570001e-2],
			[0.0000815246854464, 5.6222137132535002, 8.9111478887838003e-1],
			[-0.0000801219679602, 1.2995922951532, 1.0034433456728999],
			[-0.0000607017260182, 6.4978769669238001e-1, 5.0172167043264004e-1]
		],
		z: [
			[0.0014289811307319, 2.1256295942738999, 1.2727413029000001e-4],
			[0.000771093122676, 5.5836330003496002, 3.2064341100000001e-5],
			[0.0005925911780766, 4.0899396636447998, -1.2906864146660001e-2],
			[0.0002045597496146, 5.2713683670371996, -1.2523544076106e-1],
			[0.0001785118648258, 2.8743156721063001e-1, 8.7820792442520001e-1],
			[0.0001131999784893, 1.4462127277818, 3.5515522949801999],
			[-0.000065877816921, 2.2702423990985001, -1.7951364394536999],
			[0.0000497058888328, 5.9096792204858, 1.7693227129285001]
		],
		zeta: [
			[0.0015932721570848, 3.3368862796665, -1.2491307058e-4],
			[0.0008533093128905, 2.4133881688166001, 0.0],
			[0.0003513347911037, 5.9720789850126996, -3.0561017709999999e-5],
			[-0.0001441929255483, 1.0477061764435001, -5.6920632124000004e-4]
		]
	},

	// [3] Callisto
	{
		mu: 2.8249214488990899e-7,
		al: [-3.6203412913757038e-1, 3.7648623343382798e-1],
		a: [
			[0.0125879701715314, 0.0, 0.0],
			[0.000003595204947, 6.4965776007116005e-1, 5.0172168165034003e-1],
			[0.0000027580210652, 1.8084235781510001, 3.1750660413359002]
		],
		l: [
			[0.0005586040123824, 2.1404207189814999, 1.4500979323100001e-3],
			[-0.0003805813868176, 2.7358844897852999, 2.972965062e-5],
			[0.0002205152863262, 6.4979652596399995e-1, 5.0172167243580001e-1],
			[0.0001877895151158, 1.8084787604004999, 3.1750660413359002],
			[0.0000766916975242, 6.2720114319754998, 1.3928364636651001],
			[0.0000747056855106, 1.2995916202344, 1.0034433456728999]
		],
		z: [
			[0.0073755808467977, 5.5836071576083999, 3.2065099140000001e-5],
			[0.0002065924169942, 5.9209831565786004, 3.7648624194703001e-1],
			[0.0001589869764021, 2.8744006242622999e-1, 8.7820792442520001e-1],
			[-0.0001561131605348, 2.1257397865089001, 1.2727441285000001e-4],
			[0.0001486043380971, 1.4462134301023, 3.5515522949801999],
			[0.0000635073108731, 5.9096803285953996, 1.7693227129285001],
			[0.0000599351698525, 4.1125517584797997, -2.7985797954588998],
			[0.0000540660842731, 5.5390350845569003, 2.8683408228299999e-3],
			[-0.0000489596900866, 4.6218149483337996, -6.2695712529518999e-1]
		],
		zeta: [
			[0.0038422977898495, 2.4133922085556998, 0.0],
			[0.0022453891791894, 5.9721736773277003, -3.0561255249999997e-5],
			[-0.0002604479450559, 3.3368746306408998, -1.2491309972000001e-4],
			[0.000033211214323, 5.5604137742336999, 2.90037688507e-3]
		]
	}
];

/**
 * @brief Holds the positions and velocities of Jupiter's major 4 moons.
 *
 * The {@link JupiterMoons} function returns an object of this type
 * to report position and velocity vectors for Jupiter's largest 4 moons
 * Io, Europa, Ganymede, and Callisto. Each position vector is relative
 * to the center of Jupiter. Both position and velocity are oriented in
 * the EQJ system (that is, using Earth's equator at the J2000 epoch).
 * The positions are expressed in astronomical units (AU),
 * and the velocities in AU/day.
 *
 * @property {StateVector} io
 *      The position and velocity of Jupiter's moon Io.
 *
 * @property {StateVector} europa
 *      The position and velocity of Jupiter's moon Europa.
 *
 * @property {StateVector} ganymede
 *      The position and velocity of Jupiter's moon Ganymede.
 *
 * @property {StateVector} callisto
 *      The position and velocity of Jupiter's moon Callisto.
 */
export class JupiterMoonsInfo {
	constructor(
		public io: StateVector,
		public europa: StateVector,
		public ganymede: StateVector,
		public callisto: StateVector
	) {}
}

function JupiterMoon_elem2pv(
	time: AstroTime,
	mu: number,
	elem: [number, number, number, number, number, number]
): StateVector {
	// Translation of FORTRAN subroutine ELEM2PV from:
	// https://ftp.imcce.fr/pub/ephem/satel/galilean/L1/L1.2/

	const A = elem[0];
	const AL = elem[1];
	const K = elem[2];
	const H = elem[3];
	const Q = elem[4];
	const P = elem[5];

	const AN = Math.sqrt(mu / (A * A * A));

	let CE: number, SE: number, DE: number;
	let EE = AL + K * Math.sin(AL) - H * Math.cos(AL);
	do {
		CE = Math.cos(EE);
		SE = Math.sin(EE);
		DE = (AL - EE + K * SE - H * CE) / (1.0 - K * CE - H * SE);
		EE += DE;
	} while (Math.abs(DE) >= 1.0e-12);

	CE = Math.cos(EE);
	SE = Math.sin(EE);
	const DLE = H * CE - K * SE;
	const RSAM1 = -K * CE - H * SE;
	const ASR = 1.0 / (1.0 + RSAM1);
	const PHI = Math.sqrt(1.0 - K * K - H * H);
	const PSI = 1.0 / (1.0 + PHI);
	const X1 = A * (CE - K - PSI * H * DLE);
	const Y1 = A * (SE - H + PSI * K * DLE);
	const VX1 = AN * ASR * A * (-SE - PSI * H * RSAM1);
	const VY1 = AN * ASR * A * (+CE + PSI * K * RSAM1);
	const F2 = 2.0 * Math.sqrt(1.0 - Q * Q - P * P);
	const P2 = 1.0 - 2.0 * P * P;
	const Q2 = 1.0 - 2.0 * Q * Q;
	const PQ = 2.0 * P * Q;

	return new StateVector(
		X1 * P2 + Y1 * PQ,
		X1 * PQ + Y1 * Q2,
		(Q * Y1 - X1 * P) * F2,
		VX1 * P2 + VY1 * PQ,
		VX1 * PQ + VY1 * Q2,
		(Q * VY1 - VX1 * P) * F2,
		time
	);
}

function CalcJupiterMoon(time: AstroTime, m: jupiter_moon_t): StateVector {
	// This is a translation of FORTRAN code by Duriez, Lainey, and Vienne:
	// https://ftp.imcce.fr/pub/ephem/satel/galilean/L1/L1.2/

	const t = time.tt + 18262.5; // number of days since 1950-01-01T00:00:00Z

	// Calculate 6 orbital elements at the given time t
	const elem: [number, number, number, number, number, number] = [
		0,
		m.al[0] + t * m.al[1],
		0,
		0,
		0,
		0
	];

	for (let [amplitude, phase, frequency] of m.a)
		elem[0] += amplitude * Math.cos(phase + t * frequency);

	for (let [amplitude, phase, frequency] of m.l)
		elem[1] += amplitude * Math.sin(phase + t * frequency);

	elem[1] %= PI2;
	if (elem[1] < 0) elem[1] += PI2;

	for (let [amplitude, phase, frequency] of m.z) {
		const arg = phase + t * frequency;
		elem[2] += amplitude * Math.cos(arg);
		elem[3] += amplitude * Math.sin(arg);
	}

	for (let [amplitude, phase, frequency] of m.zeta) {
		const arg = phase + t * frequency;
		elem[4] += amplitude * Math.cos(arg);
		elem[5] += amplitude * Math.sin(arg);
	}

	// Convert the oribital elements into position vectors in the Jupiter equatorial system (JUP).
	const state = JupiterMoon_elem2pv(time, m.mu, elem);

	// Re-orient position and velocity vectors from Jupiter-equatorial (JUP) to Earth-equatorial in J2000 (EQJ).
	return RotateState(Rotation_JUP_EQJ, state);
}

/**
 * @brief Calculates jovicentric positions and velocities of Jupiter's largest 4 moons.
 *
 * Calculates position and velocity vectors for Jupiter's moons
 * Io, Europa, Ganymede, and Callisto, at the given date and time.
 * The vectors are jovicentric (relative to the center of Jupiter).
 * Their orientation is the Earth's equatorial system at the J2000 epoch (EQJ).
 * The position components are expressed in astronomical units (AU), and the
 * velocity components are in AU/day.
 *
 * To convert to heliocentric vectors, call {@link HelioVector}
 * with `Astronomy.Body.Jupiter` to get Jupiter's heliocentric position, then
 * add the jovicentric vectors. Likewise, you can call {@link GeoVector}
 * to convert to geocentric vectors.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate Jupiter's moons.
 *
 * @return {JupiterMoonsInfo}
 *      Position and velocity vectors of Jupiter's largest 4 moons.
 */
export function JupiterMoons(date: FlexibleDateTime): JupiterMoonsInfo {
	const time = new AstroTime(date);
	return new JupiterMoonsInfo(
		CalcJupiterMoon(time, JupiterMoonModel[0]),
		CalcJupiterMoon(time, JupiterMoonModel[1]),
		CalcJupiterMoon(time, JupiterMoonModel[2]),
		CalcJupiterMoon(time, JupiterMoonModel[3])
	);
}

// Jupiter Moons ends --------------------------------------------------------

/**
 * @brief Calculates a vector from the center of the Sun to the given body at the given time.
 *
 * Calculates heliocentric (i.e., with respect to the center of the Sun)
 * Cartesian coordinates in the J2000 equatorial system of a celestial
 * body at a specified time. The position is not corrected for light travel time or aberration.
 *
 * @param {Body} body
 *      One of the following values:
 *      `Body.Sun`, `Body.Moon`, `Body.Mercury`, `Body.Venus`,
 *      `Body.Earth`, `Body.Mars`, `Body.Jupiter`, `Body.Saturn`,
 *      `Body.Uranus`, `Body.Neptune`, `Body.Pluto`,
 *      `Body.SSB`, or `Body.EMB`.
 *      Also allowed to be a user-defined star created by {@link DefineStar}.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which the body's position is to be calculated.
 *
 * @returns {Vector}
 */
export function HelioVector(body: Body, date: FlexibleDateTime): Vector {
	var time = MakeTime(date);

	if (body in vsop) return CalcVsop(vsop[body], time);
	if (body === Body.Pluto) {
		const p = CalcPluto(time, true);
		return new Vector(p.x, p.y, p.z, time);
	}
	if (body === Body.Sun) return new Vector(0, 0, 0, time);
	if (body === Body.Moon) {
		var e = CalcVsop(vsop.Earth, time);
		var m = GeoMoon(time);
		return new Vector(e.x + m.x, e.y + m.y, e.z + m.z, time);
	}
	if (body === Body.EMB) {
		const e = CalcVsop(vsop.Earth, time);
		const m = GeoMoon(time);
		const denom = 1.0 + EARTH_MOON_MASS_RATIO;
		return new Vector(e.x + m.x / denom, e.y + m.y / denom, e.z + m.z / denom, time);
	}
	if (body === Body.SSB) return CalcSolarSystemBarycenter(time);

	const star = UserDefinedStar(body);
	if (star) {
		const sphere = new Spherical(star.dec, 15 * star.ra, star.dist);
		return VectorFromSphere(sphere, time);
	}
	throw `HelioVector: Unknown body "${body}"`;
}

/**
 * @brief Calculates the distance between a body and the Sun at a given time.
 *
 * Given a date and time, this function calculates the distance between
 * the center of `body` and the center of the Sun.
 * For the planets Mercury through Neptune, this function is significantly
 * more efficient than calling {@link HelioVector} followed by taking the length
 * of the resulting vector.
 *
 * @param {Body} body
 *      A body for which to calculate a heliocentric distance:
 *      the Sun, Moon, any of the planets, or a user-defined star.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the heliocentric distance.
 *
 * @returns {number}
 *      The heliocentric distance in AU.
 */
export function HelioDistance(body: Body, date: FlexibleDateTime): number {
	const star = UserDefinedStar(body);
	if (star) return star.dist;
	const time = MakeTime(date);
	if (body in vsop) return VsopFormula(vsop[body][RAD_INDEX], time.tt / DAYS_PER_MILLENNIUM, false);
	return HelioVector(body, time).Length();
}

/**
 * Solve for light travel time of a vector function.
 *
 * When observing a distant object, for example Jupiter as seen from Earth,
 * the amount of time it takes for light to travel from the object to the
 * observer can significantly affect the object's apparent position.
 * This function is a generic solver that figures out how long in the
 * past light must have left the observed object to reach the observer
 * at the specified observation time. It requires passing in `func`
 * to express an arbitrary position vector as a function of time.
 *
 * `CorrectLightTravel` repeatedly calls `func`, passing a series of time
 * estimates in the past. Then `func` must return a relative position vector between
 * the observer and the target. `CorrectLightTravel` keeps calling
 * `func` with more and more refined estimates of the time light must have
 * left the target to arrive at the observer.
 *
 * For common use cases, it is simpler to use {@link BackdatePosition}
 * for calculating the light travel time correction of one body observing another body.
 *
 * For geocentric calculations, {@link GeoVector} also backdates the returned
 * position vector for light travel time, only it returns the observation time in
 * the returned vector's `t` field rather than the backdated time.
 *
 * @param {function(AstroTime): number} func
 *      An arbitrary position vector as a function of time:
 *      function({@link AstroTime}) =&gt; {@link Vector}.
 *
 * @param {AstroTime} time
 *      The observation time for which to solve for light travel delay.
 *
 * @returns {AstroVector}
 *      The position vector at the solved backdated time.
 *      The `t` field holds the time that light left the observed
 *      body to arrive at the observer at the observation time.
 */
export function CorrectLightTravel(func: (t: AstroTime) => Vector, time: AstroTime): Vector {
	let ltime = time;
	let dt: number = 0;
	for (let iter = 0; iter < 10; ++iter) {
		const pos = func(ltime);
		const lt = pos.Length() / C_AUDAY;

		// This solver does not support more than one light-day of distance,
		// because that would cause convergence problems and inaccurate
		// values for stellar aberration angles.
		if (lt > 1.0) throw `Object is too distant for light-travel solver.`;

		const ltime2 = time.AddDays(-lt);
		dt = Math.abs(ltime2.tt - ltime.tt);
		if (dt < 1.0e-9)
			// 86.4 microseconds
			return pos;
		ltime = ltime2;
	}
	throw `Light-travel time solver did not converge: dt = ${dt}`;
}

class BodyPosition {
	constructor(
		private observerBody: Body,
		private targetBody: Body,
		private aberration: boolean,
		private observerPos: Vector
	) {}

	Position(time: AstroTime): Vector {
		if (this.aberration) {
			// The following discussion is worded with the observer body being the Earth,
			// which is often the case. However, the same reasoning applies to any observer body
			// without loss of generality.
			//
			// To include aberration, make a good first-order approximation
			// by backdating the Earth's position also.
			// This is confusing, but it works for objects within the Solar System
			// because the distance the Earth moves in that small amount of light
			// travel time (a few minutes to a few hours) is well approximated
			// by a line segment that substends the angle seen from the remote
			// body viewing Earth. That angle is pretty close to the aberration
			// angle of the moving Earth viewing the remote body.
			// In other words, both of the following approximate the aberration angle:
			//     (transverse distance Earth moves) / (distance to body)
			//     (transverse speed of Earth) / (speed of light).
			this.observerPos = HelioVector(this.observerBody, time);
		} else {
			// No aberration, so use the pre-calculated initial position of
			// the observer body that is already stored in `observerPos`.
		}
		const targetPos = HelioVector(this.targetBody, time);
		return new Vector(
			targetPos.x - this.observerPos.x,
			targetPos.y - this.observerPos.y,
			targetPos.z - this.observerPos.z,
			time
		);
	}
}

/**
 * @brief Solve for light travel time correction of apparent position.
 *
 * When observing a distant object, for example Jupiter as seen from Earth,
 * the amount of time it takes for light to travel from the object to the
 * observer can significantly affect the object's apparent position.
 *
 * This function solves the light travel time correction for the apparent
 * relative position vector of a target body as seen by an observer body
 * at a given observation time.
 *
 * For geocentric calculations, {@link GeoVector} also includes light
 * travel time correction, but the time `t` embedded in its returned vector
 * refers to the observation time, not the backdated time that light left
 * the observed body. Thus `BackdatePosition` provides direct
 * access to the light departure time for callers that need it.
 *
 * For a more generalized light travel correction solver, see {@link CorrectLightTravel}.
 *
 * @param {FlexibleDateTime} date
 *      The time of observation.
 *
 * @param {Body} observerBody
 *      The body to be used as the observation location.
 *
 * @param {Body} targetBody
 *      The body to be observed.
 *
 * @param {boolean} aberration
 *      `true` to correct for aberration, or `false` to leave uncorrected.
 *
 * @returns {Vector}
 *      The position vector at the solved backdated time.
 *      The `t` field holds the time that light left the observed
 *      body to arrive at the observer at the observation time.
 */
export function BackdatePosition(
	date: FlexibleDateTime,
	observerBody: Body,
	targetBody: Body,
	aberration: boolean
): Vector {
	VerifyBoolean(aberration);
	const time = MakeTime(date);
	if (UserDefinedStar(targetBody)) {
		// This is a user-defined star, which must be treated as a special case.
		// First, we assume its heliocentric position does not change with time.
		// Second, we assume its heliocentric position has already been corrected
		// for light-travel time, its coordinates given as it appears on Earth at the present.
		// Therefore, no backdating is applied.
		const tvec = HelioVector(targetBody, time);
		if (aberration) {
			// (Observer velocity) - (light vector) = (Aberration-corrected direction to target body).
			// Note that this is an approximation, because technically the light vector should
			// be measured in barycentric coordinates, not heliocentric. The error is very small.
			const ostate = HelioState(observerBody, time);
			const rvec = new Vector(tvec.x - ostate.x, tvec.y - ostate.y, tvec.z - ostate.z, time);
			const s = C_AUDAY / rvec.Length(); // conversion factor from relative distance to speed of light
			return new Vector(
				rvec.x + ostate.vx / s,
				rvec.y + ostate.vy / s,
				rvec.z + ostate.vz / s,
				time
			);
		}
		// No correction is needed. Simply return the star's current position as seen from the observer.
		const ovec = HelioVector(observerBody, time);
		return new Vector(tvec.x - ovec.x, tvec.y - ovec.y, tvec.z - ovec.z, time);
	}
	let observerPos: Vector;
	if (aberration) {
		// With aberration, `BackdatePosition` will calculate `observerPos` at different times.
		// Therefore, do not waste time calculating it now.
		// Create a placeholder value that will be ignored.
		observerPos = new Vector(0, 0, 0, time);
	} else {
		observerPos = HelioVector(observerBody, time);
	}
	const bpos = new BodyPosition(observerBody, targetBody, aberration, observerPos);
	return CorrectLightTravel((t) => bpos.Position(t), time);
}

/**
 * @brief Calculates a vector from the center of the Earth to the given body at the given time.
 *
 * Calculates geocentric (i.e., with respect to the center of the Earth)
 * Cartesian coordinates in the J2000 equatorial system of a celestial
 * body at a specified time. The position is always corrected for light travel time:
 * this means the position of the body is "back-dated" based on how long it
 * takes light to travel from the body to an observer on the Earth.
 * Also, the position can optionally be corrected for aberration, an effect
 * causing the apparent direction of the body to be shifted based on
 * transverse movement of the Earth with respect to the rays of light
 * coming from that body.
 *
 * @param {Body} body
 *      One of the following values:
 *      `Body.Sun`, `Body.Moon`, `Body.Mercury`, `Body.Venus`,
 *      `Body.Earth`, `Body.Mars`, `Body.Jupiter`, `Body.Saturn`,
 *      `Body.Uranus`, `Body.Neptune`, or `Body.Pluto`.
 *      Also allowed to be a user-defined star created with {@link DefineStar}.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which the body's position is to be calculated.
 *
 * @param {boolean} aberration
 *      Pass `true` to correct for
 *      <a href="https://en.wikipedia.org/wiki/Aberration_of_light">aberration</a>,
 *      or `false` to leave uncorrected.
 *
 * @returns {Vector}
 */
export function GeoVector(body: Body, date: FlexibleDateTime, aberration: boolean): Vector {
	VerifyBoolean(aberration);
	const time = MakeTime(date);
	switch (body) {
		case Body.Earth:
			return new Vector(0, 0, 0, time);

		case Body.Moon:
			return GeoMoon(time);

		default:
			const vec = BackdatePosition(time, Body.Earth, body, aberration);
			vec.t = time; // tricky: return the observation time, not the backdated time
			return vec;
	}
}

function ExportState(terse: body_state_t, time: AstroTime): StateVector {
	return new StateVector(terse.r.x, terse.r.y, terse.r.z, terse.v.x, terse.v.y, terse.v.z, time);
}

/**
 * @brief  Calculates barycentric position and velocity vectors for the given body.
 *
 * Given a body and a time, calculates the barycentric position and velocity
 * vectors for the center of that body at that time.
 * The vectors are expressed in J2000 mean equator coordinates (EQJ).
 *
 * @param {Body} body
 *      The celestial body whose barycentric state vector is to be calculated.
 *      Supported values are `Body.Sun`, `Body.Moon`, `Body.EMB`, `Body.SSB`, and all planets:
 *      `Body.Mercury`, `Body.Venus`, `Body.Earth`, `Body.Mars`, `Body.Jupiter`,
 *      `Body.Saturn`, `Body.Uranus`, `Body.Neptune`, `Body.Pluto`.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate position and velocity.
 *
 *  @returns {StateVector}
 *      An object that contains barycentric position and velocity vectors.
 */
export function BaryState(body: Body, date: FlexibleDateTime): StateVector {
	const time = MakeTime(date);
	if (body === Body.SSB) {
		// Trivial case: the solar system barycenter itself.
		return new StateVector(0, 0, 0, 0, 0, 0, time);
	}

	if (body === Body.Pluto) {
		return CalcPluto(time, false);
	}

	// Find the barycentric positions and velocities for the 5 major bodies:
	// Sun, Jupiter, Saturn, Uranus, Neptune.
	const bary = new major_bodies_t(time.tt);

	switch (body) {
		case Body.Sun:
			return ExportState(bary.Sun, time);
		case Body.Jupiter:
			return ExportState(bary.Jupiter, time);
		case Body.Saturn:
			return ExportState(bary.Saturn, time);
		case Body.Uranus:
			return ExportState(bary.Uranus, time);
		case Body.Neptune:
			return ExportState(bary.Neptune, time);

		case Body.Moon:
		case Body.EMB:
			const earth = CalcVsopPosVel(vsop[Body.Earth], time.tt);
			const state = body === Body.Moon ? GeoMoonState(time) : GeoEmbState(time);
			return new StateVector(
				state.x + bary.Sun.r.x + earth.r.x,
				state.y + bary.Sun.r.y + earth.r.y,
				state.z + bary.Sun.r.z + earth.r.z,
				state.vx + bary.Sun.v.x + earth.v.x,
				state.vy + bary.Sun.v.y + earth.v.y,
				state.vz + bary.Sun.v.z + earth.v.z,
				time
			);
	}

	// Handle the remaining VSOP bodies: Mercury, Venus, Earth, Mars.
	if (body in vsop) {
		const planet = CalcVsopPosVel(vsop[body], time.tt);
		return new StateVector(
			bary.Sun.r.x + planet.r.x,
			bary.Sun.r.y + planet.r.y,
			bary.Sun.r.z + planet.r.z,
			bary.Sun.v.x + planet.v.x,
			bary.Sun.v.y + planet.v.y,
			bary.Sun.v.z + planet.v.z,
			time
		);
	}

	throw `BaryState: Unsupported body "${body}"`;
}

/**
 * @brief  Calculates heliocentric position and velocity vectors for the given body.
 *
 * Given a body and a time, calculates the position and velocity
 * vectors for the center of that body at that time, relative to the center of the Sun.
 * The vectors are expressed in J2000 mean equator coordinates (EQJ).
 * If you need the position vector only, it is more efficient to call {@link HelioVector}.
 * The Sun's center is a non-inertial frame of reference. In other words, the Sun
 * experiences acceleration due to gravitational forces, mostly from the larger
 * planets (Jupiter, Saturn, Uranus, and Neptune). If you want to calculate momentum,
 * kinetic energy, or other quantities that require a non-accelerating frame
 * of reference, consider using {@link BaryState} instead.
 *
 * @param {Body} body
 *      The celestial body whose heliocentric state vector is to be calculated.
 *      Supported values are `Body.Sun`, `Body.Moon`, `Body.EMB`, `Body.SSB`, and all planets:
 *      `Body.Mercury`, `Body.Venus`, `Body.Earth`, `Body.Mars`, `Body.Jupiter`,
 *      `Body.Saturn`, `Body.Uranus`, `Body.Neptune`, `Body.Pluto`.
 *      Also allowed to be a user-defined star created by {@link DefineStar}.
 *
 *  @param {FlexibleDateTime} date
 *      The date and time for which to calculate position and velocity.
 *
 *  @returns {StateVector}
 *      An object that contains heliocentric position and velocity vectors.
 */
export function HelioState(body: Body, date: FlexibleDateTime): StateVector {
	const time = MakeTime(date);
	switch (body) {
		case Body.Sun:
			// Trivial case: the Sun is the origin of the heliocentric frame.
			return new StateVector(0.0, 0.0, 0.0, 0.0, 0.0, 0.0, time);

		case Body.SSB:
			// Calculate the barycentric Sun. Then the negative of that is the heliocentric SSB.
			const bary = new major_bodies_t(time.tt);
			return new StateVector(
				-bary.Sun.r.x,
				-bary.Sun.r.y,
				-bary.Sun.r.z,
				-bary.Sun.v.x,
				-bary.Sun.v.y,
				-bary.Sun.v.z,
				time
			);

		case Body.Mercury:
		case Body.Venus:
		case Body.Earth:
		case Body.Mars:
		case Body.Jupiter:
		case Body.Saturn:
		case Body.Uranus:
		case Body.Neptune:
			// Planets included in the VSOP87 model.
			const planet = CalcVsopPosVel(vsop[body], time.tt);
			return ExportState(planet, time);

		case Body.Pluto:
			return CalcPluto(time, true);

		case Body.Moon:
		case Body.EMB:
			const earth = CalcVsopPosVel(vsop.Earth, time.tt);
			const state = body == Body.Moon ? GeoMoonState(time) : GeoEmbState(time);
			return new StateVector(
				state.x + earth.r.x,
				state.y + earth.r.y,
				state.z + earth.r.z,
				state.vx + earth.v.x,
				state.vy + earth.v.y,
				state.vz + earth.v.z,
				time
			);

		default:
			if (UserDefinedStar(body)) {
				const vec = HelioVector(body, time);
				return new StateVector(vec.x, vec.y, vec.z, 0, 0, 0, time);
			}
			throw `HelioState: Unsupported body "${body}"`;
	}
}

interface InterpResult {
	t: number;
	df_dt: number;
}

function QuadInterp(
	tm: number,
	dt: number,
	fa: number,
	fm: number,
	fb: number
): InterpResult | null {
	let Q = (fb + fa) / 2 - fm;
	let R = (fb - fa) / 2;
	let S = fm;
	let x: number;

	if (Q == 0) {
		// This is a line, not a parabola.
		if (R == 0) {
			// This is a HORIZONTAL line... can't make progress!
			return null;
		}
		x = -S / R;
		if (x < -1 || x > +1) return null; // out of bounds
	} else {
		// It really is a parabola. Find roots x1, x2.
		let u = R * R - 4 * Q * S;
		if (u <= 0) return null;
		let ru = Math.sqrt(u);
		let x1 = (-R + ru) / (2 * Q);
		let x2 = (-R - ru) / (2 * Q);

		if (-1 <= x1 && x1 <= +1) {
			if (-1 <= x2 && x2 <= +1) return null;
			x = x1;
		} else if (-1 <= x2 && x2 <= +1) {
			x = x2;
		} else {
			return null;
		}
	}

	let t = tm + x * dt;
	let df_dt = (2 * Q * x + R) / dt;
	return { t: t, df_dt: df_dt };
}

// Quirk: for some reason, I need to put the interface declaration *before* its
// documentation, or jsdoc2md will strip it out.

export interface SearchOptions {
	dt_tolerance_seconds?: number;
	init_f1?: number;
	init_f2?: number;
	iter_limit?: number;
}

/**
 * @brief Options for the {@link Search} function.
 *
 * @typedef {object} SearchOptions
 *
 * @property {number | undefined} dt_tolerance_seconds
 *      The number of seconds for a time window smaller than which the search
 *      is considered successful.  Using too large a tolerance can result in
 *      an inaccurate time estimate.  Using too small a tolerance can cause
 *      excessive computation, or can even cause the search to fail because of
 *      limited floating-point resolution.  Defaults to 1 second.
 *
 * @property {number | undefined} init_f1
 *      As an optimization, if the caller of {@link Search}
 *      has already calculated the value of the function being searched (the parameter `func`)
 *      at the time coordinate `t1`, it can pass in that value as `init_f1`.
 *      For very expensive calculations, this can measurably improve performance.
 *
 * @property {number | undefined} init_f2
 *      The same as `init_f1`, except this is the optional initial value of `func(t2)`
 *      instead of `func(t1)`.
 *
 * @property {number | undefined} iter_limit
 */

/**
 * @brief Finds the time when a function ascends through zero.
 *
 * Search for next time <i>t</i> (such that <i>t</i> is between `t1` and `t2`)
 * that `func(t)` crosses from a negative value to a non-negative value.
 * The given function must have "smooth" behavior over the entire inclusive range [`t1`, `t2`],
 * meaning that it behaves like a continuous differentiable function.
 * It is not required that `t1` &lt; `t2`; `t1` &gt; `t2`
 * allows searching backward in time.
 * Note: `t1` and `t2` must be chosen such that there is no possibility
 * of more than one zero-crossing (ascending or descending), or it is possible
 * that the "wrong" event will be found (i.e. not the first event after t1)
 * or even that the function will return `null`, indicating that no event was found.
 *
 * @param {function(AstroTime): number} func
 *      The function to find an ascending zero crossing for.
 *      The function must accept a single parameter of type {@link AstroTime}
 *      and return a numeric value:
 *      function({@link AstroTime}) =&gt; `number`
 *
 * @param {AstroTime} t1
 *      The lower time bound of a search window.
 *
 * @param {AstroTime} t2
 *      The upper time bound of a search window.
 *
 * @param {SearchOptions | undefined} options
 *      Options that can tune the behavior of the search.
 *      Most callers can omit this argument.
 *
 * @returns {AstroTime | null}
 *      If the search is successful, returns the date and time of the solution.
 *      If the search fails, returns `null`.
 */
export function Search(
	f: (t: AstroTime) => number,
	t1: AstroTime,
	t2: AstroTime,
	options?: SearchOptions
): AstroTime | null {
	const dt_tolerance_seconds = VerifyNumber((options && options.dt_tolerance_seconds) || 1);

	const dt_days = Math.abs(dt_tolerance_seconds / SECONDS_PER_DAY);

	let f1 = (options && options.init_f1) || f(t1);
	let f2 = (options && options.init_f2) || f(t2);
	let fmid: number = NaN;

	let iter = 0;
	let iter_limit = (options && options.iter_limit) || 20;
	let calc_fmid = true;
	while (true) {
		if (++iter > iter_limit) throw `Excessive iteration in Search()`;

		let tmid = InterpolateTime(t1, t2, 0.5);
		let dt = tmid.ut - t1.ut;

		if (Math.abs(dt) < dt_days) {
			// We are close enough to the event to stop the search.
			return tmid;
		}

		if (calc_fmid) fmid = f(tmid);
		else calc_fmid = true; // we already have the correct value of fmid from the previous loop

		// Quadratic interpolation:
		// Try to find a parabola that passes through the 3 points we have sampled:
		// (t1,f1), (tmid,fmid), (t2,f2).
		let q = QuadInterp(tmid.ut, t2.ut - tmid.ut, f1, fmid, f2);

		// Did we find an approximate root-crossing?
		if (q) {
			// Evaluate the function at our candidate solution.
			let tq = MakeTime(q.t);
			let fq = f(tq);

			if (q.df_dt !== 0) {
				if (Math.abs(fq / q.df_dt) < dt_days) {
					// The estimated time error is small enough that we can quit now.
					return tq;
				}

				// Try guessing a tighter boundary with the interpolated root at the center.
				let dt_guess = 1.2 * Math.abs(fq / q.df_dt);
				if (dt_guess < dt / 10) {
					let tleft = tq.AddDays(-dt_guess);
					let tright = tq.AddDays(+dt_guess);
					if ((tleft.ut - t1.ut) * (tleft.ut - t2.ut) < 0) {
						if ((tright.ut - t1.ut) * (tright.ut - t2.ut) < 0) {
							let fleft = f(tleft);
							let fright = f(tright);
							if (fleft < 0 && fright >= 0) {
								f1 = fleft;
								f2 = fright;
								t1 = tleft;
								t2 = tright;
								fmid = fq;
								calc_fmid = false;
								continue;
							}
						}
					}
				}
			}
		}

		if (f1 < 0 && fmid >= 0) {
			t2 = tmid;
			f2 = fmid;
			continue;
		}

		if (fmid < 0 && f2 >= 0) {
			t1 = tmid;
			f1 = fmid;
			continue;
		}

		// Either there is no ascending zero-crossing in this range
		// or the search window is too wide.
		return null;
	}
}

function LongitudeOffset(diff: number): number {
	let offset = diff;
	while (offset <= -180) offset += 360;
	while (offset > 180) offset -= 360;
	return offset;
}

function NormalizeLongitude(lon: number): number {
	while (lon < 0) lon += 360;
	while (lon >= 360) lon -= 360;
	return lon;
}

/**
 * @brief Searches for when the Sun reaches a given ecliptic longitude.
 *
 * Searches for the moment in time when the center of the Sun reaches a given apparent
 * ecliptic longitude, as seen from the center of the Earth, within a given range of dates.
 * This function can be used to determine equinoxes and solstices.
 * However, it is usually more convenient and efficient to call {@link Seasons}
 * to calculate equinoxes and solstices for a given calendar year.
 * `SearchSunLongitude` is more general in that it allows searching for arbitrary longitude values.
 *
 * @param {number} targetLon
 *      The desired ecliptic longitude of date in degrees.
 *      This may be any value in the range [0, 360), although certain
 *      values have conventional meanings:
 *
 *      When `targetLon` is 0, finds the March equinox,
 *      which is the moment spring begins in the northern hemisphere
 *      and the beginning of autumn in the southern hemisphere.
 *
 *      When `targetLon` is 180, finds the September equinox,
 *      which is the moment autumn begins in the northern hemisphere and
 *      spring begins in the southern hemisphere.
 *
 *      When `targetLon` is 90, finds the northern solstice, which is the
 *      moment summer begins in the northern hemisphere and winter
 *      begins in the southern hemisphere.
 *
 *      When `targetLon` is 270, finds the southern solstice, which is the
 *      moment winter begins in the northern hemisphere and summer
 *      begins in the southern hemisphere.
 *
 * @param {FlexibleDateTime} dateStart
 *      A date and time known to be earlier than the desired longitude event.
 *
 * @param {number} limitDays
 *      A floating point number of days, which when added to `dateStart`,
 *      yields a date and time known to be after the desired longitude event.
 *
 * @returns {AstroTime | null}
 *      The date and time when the Sun reaches the apparent ecliptic longitude `targetLon`
 *      within the range of times specified by `dateStart` and `limitDays`.
 *      If the Sun does not reach the target longitude within the specified time range, or the
 *      time range is excessively wide, the return value is `null`.
 *      To avoid a `null` return value, the caller must pick a time window around
 *      the event that is within a few days but not so small that the event might fall outside the window.
 */
export function SearchSunLongitude(
	targetLon: number,
	dateStart: FlexibleDateTime,
	limitDays: number
): AstroTime | null {
	function sun_offset(t: AstroTime): number {
		let pos = SunPosition(t);
		return LongitudeOffset(pos.elon - targetLon);
	}
	VerifyNumber(targetLon);
	VerifyNumber(limitDays);
	let t1 = MakeTime(dateStart);
	let t2 = t1.AddDays(limitDays);
	return Search(sun_offset, t1, t2, { dt_tolerance_seconds: 0.01 });
}

/**
 * @brief Returns one body's ecliptic longitude with respect to another, as seen from the Earth.
 *
 * This function determines where one body appears around the ecliptic plane
 * (the plane of the Earth's orbit around the Sun) as seen from the Earth,
 * relative to the another body's apparent position.
 * The function returns an angle in the half-open range [0, 360) degrees.
 * The value is the ecliptic longitude of `body1` relative to the ecliptic
 * longitude of `body2`.
 *
 * The angle is 0 when the two bodies are at the same ecliptic longitude
 * as seen from the Earth. The angle increases in the prograde direction
 * (the direction that the planets orbit the Sun and the Moon orbits the Earth).
 *
 * When the angle is 180 degrees, it means the two bodies appear on opposite sides
 * of the sky for an Earthly observer.
 *
 * Neither `body1` nor `body2` is allowed to be `Body.Earth`.
 * If this happens, the function throws an exception.
 *
 * @param {Body} body1
 *      The first body, whose longitude is to be found relative to the second body.
 *
 * @param {Body} body2
 *      The second body, relative to which the longitude of the first body is to be found.
 *
 * @param {FlexibleDateTime} date
 *      The date and time of the observation.
 *
 * @returns {number}
 *      An angle in the range [0, 360), expressed in degrees.
 */
export function PairLongitude(body1: Body, body2: Body, date: FlexibleDateTime): number {
	if (body1 === Body.Earth || body2 === Body.Earth)
		throw 'The Earth does not have a longitude as seen from itself.';

	const time = MakeTime(date);

	const vector1 = GeoVector(body1, time, false);
	const eclip1 = Ecliptic(vector1);

	const vector2 = GeoVector(body2, time, false);
	const eclip2 = Ecliptic(vector2);

	return NormalizeLongitude(eclip1.elon - eclip2.elon);
}

/**
 * @brief Calculates the angular separation between the Sun and the given body.
 *
 * Returns the full angle seen from
 * the Earth, between the given body and the Sun.
 * Unlike {@link PairLongitude}, this function does not
 * project the body's "shadow" onto the ecliptic;
 * the angle is measured in 3D space around the plane that
 * contains the centers of the Earth, the Sun, and `body`.
 *
 * @param {Body} body
 *      The name of a supported celestial body other than the Earth.
 *
 * @param {FlexibleDateTime} date
 *      The time at which the angle from the Sun is to be found.
 *
 * @returns {number}
 *      An angle in degrees in the range [0, 180].
 */
export function AngleFromSun(body: Body, date: FlexibleDateTime): number {
	if (body == Body.Earth) throw 'The Earth does not have an angle as seen from itself.';

	const time = MakeTime(date);
	const sv = GeoVector(Body.Sun, time, true);
	const bv = GeoVector(body, time, true);
	const angle = AngleBetween(sv, bv);
	return angle;
}

/**
 * @brief Calculates heliocentric ecliptic longitude of a body.
 *
 * This function calculates the angle around the plane of the Earth's orbit
 * of a celestial body, as seen from the center of the Sun.
 * The angle is measured prograde (in the direction of the Earth's orbit around the Sun)
 * in degrees from the true equinox of date. The ecliptic longitude is always in the range [0, 360).
 *
 * @param {Body} body
 *      A body other than the Sun.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the ecliptic longitude.
 *
 * @returns {number}
 */
export function EclipticLongitude(body: Body, date: FlexibleDateTime): number {
	if (body === Body.Sun) throw 'Cannot calculate heliocentric longitude of the Sun.';

	const hv = HelioVector(body, date);
	const eclip = Ecliptic(hv);
	return eclip.elon;
}

function VisualMagnitude(body: Body, phase: number, helio_dist: number, geo_dist: number): number {
	// For Mercury and Venus, see:  https://iopscience.iop.org/article/10.1086/430212
	let c0: number,
		c1 = 0,
		c2 = 0,
		c3 = 0;
	switch (body) {
		case Body.Mercury:
			c0 = -0.6;
			c1 = +4.98;
			c2 = -4.88;
			c3 = +3.02;
			break;
		case Body.Venus:
			if (phase < 163.6) {
				c0 = -4.47;
				c1 = +1.03;
				c2 = +0.57;
				c3 = +0.13;
			} else {
				c0 = 0.98;
				c1 = -1.02;
			}
			break;
		case Body.Mars:
			c0 = -1.52;
			c1 = +1.6;
			break;
		case Body.Jupiter:
			c0 = -9.4;
			c1 = +0.5;
			break;
		case Body.Uranus:
			c0 = -7.19;
			c1 = +0.25;
			break;
		case Body.Neptune:
			c0 = -6.87;
			break;
		case Body.Pluto:
			c0 = -1.0;
			c1 = +4.0;
			break;
		default:
			throw `VisualMagnitude: unsupported body ${body}`;
	}

	const x = phase / 100;
	let mag = c0 + x * (c1 + x * (c2 + x * c3));
	mag += 5 * Math.log10(helio_dist * geo_dist);
	return mag;
}

function SaturnMagnitude(
	phase: number,
	helio_dist: number,
	geo_dist: number,
	gc: Vector,
	time: AstroTime
) {
	// Based on formulas by Paul Schlyter found here:
	// http://www.stjarnhimlen.se/comp/ppcomp.html#15

	// We must handle Saturn's rings as a major component of its visual magnitude.
	// Find geocentric ecliptic coordinates of Saturn.
	const eclip = Ecliptic(gc);
	const ir = DEG2RAD * 28.06; // tilt of Saturn's rings to the ecliptic, in radians
	const Nr = DEG2RAD * (169.51 + 3.82e-5 * time.tt); // ascending node of Saturn's rings, in radians

	// Find tilt of Saturn's rings, as seen from Earth.
	const lat = DEG2RAD * eclip.elat;
	const lon = DEG2RAD * eclip.elon;
	const tilt = Math.asin(
		Math.sin(lat) * Math.cos(ir) - Math.cos(lat) * Math.sin(ir) * Math.sin(lon - Nr)
	);
	const sin_tilt = Math.sin(Math.abs(tilt));

	let mag = -9.0 + 0.044 * phase;
	mag += sin_tilt * (-2.6 + 1.2 * sin_tilt);
	mag += 5 * Math.log10(helio_dist * geo_dist);
	return { mag: mag, ring_tilt: RAD2DEG * tilt };
}

function MoonMagnitude(phase: number, helio_dist: number, geo_dist: number): number {
	// https://astronomy.stackexchange.com/questions/10246/is-there-a-simple-analytical-formula-for-the-lunar-phase-brightness-curve
	let rad = phase * DEG2RAD;
	let rad2 = rad * rad;
	let rad4 = rad2 * rad2;
	let mag = -12.717 + 1.49 * Math.abs(rad) + 0.0431 * rad4;

	const moon_mean_distance_au = 385000.6 / KM_PER_AU;
	let geo_au = geo_dist / moon_mean_distance_au;
	mag += 5 * Math.log10(helio_dist * geo_au);
	return mag;
}

/**
 * @brief Information about the apparent brightness and sunlit phase of a celestial object.
 *
 * @property {AstroTime} time
 *      The date and time pertaining to the other calculated values in this object.
 *
 * @property {number} mag
 *      The <a href="https://en.wikipedia.org/wiki/Apparent_magnitude">apparent visual magnitude</a> of the celestial body.
 *
 * @property {number} phase_angle
 *      The angle in degrees as seen from the center of the celestial body between the Sun and the Earth.
 *      The value is always in the range 0 to 180.
 *      The phase angle provides a measure of what fraction of the body's face appears
 *      illuminated by the Sun as seen from the Earth.
 *      When the observed body is the Sun, the `phase` property is set to 0,
 *      although this has no physical meaning because the Sun emits, rather than reflects, light.
 *      When the phase is near 0 degrees, the body appears "full".
 *      When it is 90 degrees, the body appears "half full".
 *      And when it is 180 degrees, the body appears "new" and is very difficult to see
 *      because it is both dim and lost in the Sun's glare as seen from the Earth.
 *
 * @property {number} phase_fraction
 *      The fraction of the body's face that is illuminated by the Sun, as seen from the Earth.
 *      Calculated from `phase_angle` for convenience.
 *      This value ranges from 0 to 1.
 *
 * @property {number} helio_dist
 *      The distance between the center of the Sun and the center of the body in
 *      <a href="https://en.wikipedia.org/wiki/Astronomical_unit">astronomical units</a> (AU).
 *
 * @property {number} geo_dist
 *      The distance between the center of the Earth and the center of the body in AU.
 *
 * @property {Vector} gc
 *      Geocentric coordinates: the 3D vector from the center of the Earth to the center of the body.
 *      The components are in expressed in AU and are oriented with respect to the J2000 equatorial plane.
 *
 * @property {Vector} hc
 *      Heliocentric coordinates: The 3D vector from the center of the Sun to the center of the body.
 *      Like `gc`, `hc` is expressed in AU and oriented with respect
 *      to the J2000 equatorial plane.
 *
 * @property {number | undefined} ring_tilt
 *      For Saturn, this is the angular tilt of the planet's rings in degrees away
 *      from the line of sight from the Earth. When the value is near 0, the rings
 *      appear edge-on from the Earth and are therefore difficult to see.
 *      When `ring_tilt` approaches its maximum value (about 27 degrees),
 *      the rings appear widest and brightest from the Earth.
 *      Unlike the <a href="https://ssd.jpl.nasa.gov/horizons.cgi">JPL Horizons</a> online tool,
 *      this library includes the effect of the ring tilt angle in the calculated value
 *      for Saturn's visual magnitude.
 *      For all bodies other than Saturn, the value of `ring_tilt` is `undefined`.
 */
export class IlluminationInfo {
	phase_fraction: number;

	constructor(
		public time: AstroTime,
		public mag: number,
		public phase_angle: number,
		public helio_dist: number,
		public geo_dist: number,
		public gc: Vector,
		public hc: Vector,
		public ring_tilt?: number
	) {
		this.phase_fraction = (1 + Math.cos(DEG2RAD * phase_angle)) / 2;
	}
}

/**
 * @brief Calculates visual magnitude and related information about a body.
 *
 * Calculates the phase angle, visual magnitude,
 * and other values relating to the body's illumination
 * at the given date and time, as seen from the Earth.
 *
 * @param {Body} body
 *      The name of the celestial body being observed.
 *      Not allowed to be `Body.Earth`.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the illumination data for the given body.
 *
 * @returns {IlluminationInfo}
 */
export function Illumination(body: Body, date: FlexibleDateTime): IlluminationInfo {
	if (body === Body.Earth) throw `The illumination of the Earth is not defined.`;

	const time = MakeTime(date);
	const earth = CalcVsop(vsop.Earth, time);
	let phase: number; // phase angle in degrees between Earth and Sun as seen from body
	let hc: Vector; // vector from Sun to body
	let gc: Vector; // vector from Earth to body
	let mag: number; // visual magnitude

	if (body === Body.Sun) {
		gc = new Vector(-earth.x, -earth.y, -earth.z, time);
		hc = new Vector(0, 0, 0, time);
		phase = 0; // a placeholder value; the Sun does not have an illumination phase because it emits, rather than reflects, light.
	} else {
		if (body === Body.Moon) {
			// For extra numeric precision, use geocentric moon formula directly.
			gc = GeoMoon(time);
			hc = new Vector(earth.x + gc.x, earth.y + gc.y, earth.z + gc.z, time);
		} else {
			// For planets, heliocentric vector is most direct to calculate.
			hc = HelioVector(body, date);
			gc = new Vector(hc.x - earth.x, hc.y - earth.y, hc.z - earth.z, time);
		}
		phase = AngleBetween(gc, hc);
	}

	let geo_dist = gc.Length(); // distance from body to center of Earth
	let helio_dist = hc.Length(); // distance from body to center of Sun
	let ring_tilt; // only reported for Saturn

	if (body === Body.Sun) {
		mag = SUN_MAG_1AU + 5 * Math.log10(geo_dist);
	} else if (body === Body.Moon) {
		mag = MoonMagnitude(phase, helio_dist, geo_dist);
	} else if (body === Body.Saturn) {
		const saturn = SaturnMagnitude(phase, helio_dist, geo_dist, gc, time);
		mag = saturn.mag;
		ring_tilt = saturn.ring_tilt;
	} else {
		mag = VisualMagnitude(body, phase, helio_dist, geo_dist);
	}

	return new IlluminationInfo(time, mag, phase, helio_dist, geo_dist, gc, hc, ring_tilt);
}

function SynodicPeriod(body: Body): number {
	if (body === Body.Earth) throw 'The Earth does not have a synodic period as seen from itself.';

	if (body === Body.Moon) return MEAN_SYNODIC_MONTH;

	// Calculate the synodic period of the planet from its and the Earth's sidereal periods.
	// The sidereal period of a planet is how long it takes to go around the Sun in days, on average.
	// The synodic period of a planet is how long it takes between consecutive oppositions
	// or conjunctions, on average.

	let planet = Planet[body];
	if (!planet) throw `Not a valid planet name: ${body}`;

	// See here for explanation of the formula:
	// https://en.wikipedia.org/wiki/Elongation_(astronomy)#Elongation_period

	const Te = Planet.Earth.OrbitalPeriod;
	const Tp = planet.OrbitalPeriod;
	const synodicPeriod = Math.abs(Te / (Te / Tp - 1));

	return synodicPeriod;
}

/**
 * @brief Searches for when the Earth and a given body reach a relative ecliptic longitude separation.
 *
 * Searches for the date and time the relative ecliptic longitudes of
 * the specified body and the Earth, as seen from the Sun, reach a certain
 * difference. This function is useful for finding conjunctions and oppositions
 * of the planets. For the opposition of a superior planet (Mars, Jupiter, ..., Pluto),
 * or the inferior conjunction of an inferior planet (Mercury, Venus),
 * call with `targetRelLon` = 0. The 0 value indicates that both
 * planets are on the same ecliptic longitude line, ignoring the other planet's
 * distance above or below the plane of the Earth's orbit.
 * For superior conjunctions, call with `targetRelLon` = 180.
 * This means the Earth and the other planet are on opposite sides of the Sun.
 *
 * @param {Body} body
 *      Any planet other than the Earth.
 *
 * @param {number} targetRelLon
 *      The desired angular difference in degrees between the ecliptic longitudes
 *      of `body` and the Earth. Must be in the range (-180, +180].
 *
 * @param {FlexibleDateTime} startDate
 *      The date and time after which to find the next occurrence of the
 *      body and the Earth reaching the desired relative longitude.
 *
 * @returns {AstroTime}
 *      The time when the Earth and the body next reach the specified relative longitudes.
 */
export function SearchRelativeLongitude(
	body: Body,
	targetRelLon: number,
	startDate: FlexibleDateTime
): AstroTime {
	VerifyNumber(targetRelLon);
	const planet = Planet[body];
	if (!planet) throw `Cannot search relative longitude because body is not a planet: ${body}`;

	if (body === Body.Earth) throw 'Cannot search relative longitude for the Earth (it is always 0)';

	// Determine whether the Earth "gains" (+1) on the planet or "loses" (-1)
	// as both race around the Sun.
	const direction = planet.OrbitalPeriod > Planet.Earth.OrbitalPeriod ? +1 : -1;

	function offset(t: AstroTime): number {
		const plon = EclipticLongitude(body, t);
		const elon = EclipticLongitude(Body.Earth, t);
		const diff = direction * (elon - plon);
		return LongitudeOffset(diff - targetRelLon);
	}

	let syn = SynodicPeriod(body);
	let time = MakeTime(startDate);

	// Iterate until we converge on the desired event.
	// Calculate the error angle, which will be a negative number of degrees,
	// meaning we are "behind" the target relative longitude.
	let error_angle = offset(time);
	if (error_angle > 0) error_angle -= 360; // force searching forward in time

	for (let iter = 0; iter < 100; ++iter) {
		// Estimate how many days in the future (positive) or past (negative)
		// we have to go to get closer to the target relative longitude.
		let day_adjust = (-error_angle / 360) * syn;
		time = time.AddDays(day_adjust);
		if (Math.abs(day_adjust) * SECONDS_PER_DAY < 1) return time;

		let prev_angle = error_angle;
		error_angle = offset(time);

		if (Math.abs(prev_angle) < 30) {
			// Improve convergence for Mercury/Mars (eccentric orbits)
			// by adjusting the synodic period to more closely match the
			// variable speed of both planets in this part of their respective orbits.
			if (prev_angle !== error_angle) {
				let ratio = prev_angle / (prev_angle - error_angle);
				if (ratio > 0.5 && ratio < 2.0) syn *= ratio;
			}
		}
	}

	throw `Relative longitude search failed to converge for ${body} near ${time.toString()} (error_angle = ${error_angle}).`;
}

/**
 * @brief Determines the moon's phase expressed as an ecliptic longitude.
 *
 * @param {FlexibleDateTime} date
 *      The date and time for which to calculate the moon's phase.
 *
 * @returns {number}
 *      A value in the range [0, 360) indicating the difference
 *      in ecliptic longitude between the center of the Sun and the
 *      center of the Moon, as seen from the center of the Earth.
 *      Certain longitude values have conventional meanings:
 *
 * * 0 = new moon
 * * 90 = first quarter
 * * 180 = full moon
 * * 270 = third quarter
 */
export function MoonPhase(date: FlexibleDateTime): number {
	return PairLongitude(Body.Moon, Body.Sun, date);
}

/**
 * @brief Searches for the date and time that the Moon reaches a specified phase.
 *
 * Lunar phases are defined in terms of geocentric ecliptic longitudes
 * with respect to the Sun.  When the Moon and the Sun have the same ecliptic
 * longitude, that is defined as a new moon. When the two ecliptic longitudes
 * are 180 degrees apart, that is defined as a full moon.
 * To enumerate quarter lunar phases, it is simpler to call
 * {@link SearchMoonQuarter} once, followed by repeatedly calling
 * {@link NextMoonQuarter}. `SearchMoonPhase` is only
 * necessary for finding other lunar phases than the usual quarter phases.
 *
 * @param {number} targetLon
 *      The difference in geocentric ecliptic longitude between the Sun and Moon
 *      that specifies the lunar phase being sought. This can be any value
 *      in the range [0, 360). Here are some helpful examples:
 *      0 = new moon,
 *      90 = first quarter,
 *      180 = full moon,
 *      270 = third quarter.
 *
 * @param {FlexibleDateTime} dateStart
 *      The beginning of the window of time in which to search.
 *
 * @param {number} limitDays
 *      The floating point number of days away from `dateStart`
 *      that limits the window of time in which to search.
 *      If the value is negative, the search is performed into the past from `startTime`.
 *      Otherwise, the search is performed into the future from `startTime`.
 *
 * @returns {AstroTime | null}
 *      If successful, returns the date and time the moon reaches the phase specified by `targetlon`.
 *      This function will return `null` if the phase does not occur within `limitDays` of `startTime`;
 *      that is, if the search window is too small.
 */
export function SearchMoonPhase(
	targetLon: number,
	dateStart: FlexibleDateTime,
	limitDays: number
): AstroTime | null {
	function moon_offset(t: AstroTime): number {
		let mlon: number = MoonPhase(t);
		return LongitudeOffset(mlon - targetLon);
	}

	VerifyNumber(targetLon);
	VerifyNumber(limitDays);

	// To avoid discontinuities in the moon_offset function causing problems,
	// we need to approximate when that function will next return 0.
	// We probe it with the start time and take advantage of the fact
	// that every lunar phase repeats roughly every 29.5 days.
	// There is a surprising uncertainty in the quarter timing,
	// due to the eccentricity of the moon's orbit.
	// I have seen more than 0.9 days away from the simple prediction.
	// To be safe, we take the predicted time of the event and search
	// +/-1.5 days around it (a 3.0-day wide window).
	// But we must return null if the final result goes beyond limitDays after dateStart.
	const uncertainty = 1.5;
	const ta = MakeTime(dateStart);
	let ya = moon_offset(ta);
	let est_dt: number, dt1: number, dt2: number;
	if (limitDays < 0) {
		// Search backward in time.
		if (ya < 0) ya += 360;
		est_dt = -(MEAN_SYNODIC_MONTH * ya) / 360;
		dt2 = est_dt + uncertainty;
		if (dt2 < limitDays) return null; // not possible for moon phase to occur within the specified window
		dt1 = Math.max(limitDays, est_dt - uncertainty);
	} else {
		// Search forward in time.
		if (ya > 0) ya -= 360;
		est_dt = -(MEAN_SYNODIC_MONTH * ya) / 360;
		dt1 = est_dt - uncertainty;
		if (dt1 > limitDays) return null; // not possible for moon phase to occur within the specified window
		dt2 = Math.min(limitDays, est_dt + uncertainty);
	}
	const t1 = ta.AddDays(dt1);
	const t2 = ta.AddDays(dt2);
	return Search(moon_offset, t1, t2, { dt_tolerance_seconds: 0.1 });
}

/**
 * @brief A quarter lunar phase, along with when it occurs.
 *
 * @property {number} quarter
 *      An integer as follows:
 *      0 = new moon,
 *      1 = first quarter,
 *      2 = full moon,
 *      3 = third quarter.
 *
 * @property {AstroTime} time
 *      The date and time of the quarter lunar phase.
 */
export class MoonQuarter {
	constructor(public quarter: number, public time: AstroTime) {}
}

/**
 * @brief Finds the first quarter lunar phase after the specified date and time.
 *
 * The quarter lunar phases are: new moon, first quarter, full moon, and third quarter.
 * To enumerate quarter lunar phases, call `SearchMoonQuarter` once,
 * then pass its return value to {@link NextMoonQuarter} to find the next
 * `MoonQuarter`. Keep calling `NextMoonQuarter` in a loop,
 * passing the previous return value as the argument to the next call.
 *
 * @param {FlexibleDateTime} dateStart
 *      The date and time after which to find the first quarter lunar phase.
 *
 * @returns {MoonQuarter}
 */
export function SearchMoonQuarter(dateStart: FlexibleDateTime): MoonQuarter {
	// Determine what the next quarter phase will be.
	let phaseStart = MoonPhase(dateStart);
	let quarterStart = Math.floor(phaseStart / 90);
	let quarter = (quarterStart + 1) % 4;
	let time = SearchMoonPhase(90 * quarter, dateStart, 10);
	if (!time) throw 'Cannot find moon quarter';
	return new MoonQuarter(quarter, time);
}

/**
 * @brief Finds the next quarter lunar phase in a series.
 *
 * Given a {@link MoonQuarter} object, finds the next consecutive
 * quarter lunar phase. See remarks in {@link SearchMoonQuarter}
 * for explanation of usage.
 *
 * @param {MoonQuarter} mq
 *      The return value of a prior call to {@link MoonQuarter} or `NextMoonQuarter`.
 *
 * @returns {MoonQuarter}
 */
export function NextMoonQuarter(mq: MoonQuarter): MoonQuarter {
	// Skip 6 days past the previous found moon quarter to find the next one.
	// This is less than the minimum possible increment.
	// So far I have seen the interval well contained by the range (6.5, 8.3) days.
	let date = new Date(mq.time.date.getTime() + 6 * MILLIS_PER_DAY);
	return SearchMoonQuarter(date);
}
