// import { json } from '@sveltejs/kit';
// import type { RequestHandler } from './$types';
// import { format, parse } from 'date-fns';

// Internal API only for retrieving yearly moon data
// WIP
// export const GET = (async ({ url }) => {
//   // This will hold all the API responses for each date
//   const results = await Promise.all(
//     failedDates3.map(async (dateString) => {
//       // Parse the current date string into a Date object
//       const date = new Date(dateString);
//       const year = date.getFullYear();
//       const month = format(date, 'LLLL');

//       try {
//         // Make the API request for the current date
//         const response = await fetch(
//           `https://aa.usno.navy.mil/api/rstt/oneday?date=${dateString}&coords=44.9772995,-93.2654692`
//         );

//         // Handle response and parse the data
//         if (!response.ok) {
//           throw new Error(`Failed to fetch data for date: ${dateString}`);
//         }

//         const parsedData = await response.json();
//         const { properties } = parsedData;
//         const { curphase, fracillum } = properties.data;

//         // Prepare the formatted result for this date
//         return {
//           date: dateString,
//           month,
//           year,
//           phase: curphase,
//           illumination: parseFloat(fracillum) / 100,
//         };
//       } catch (err) {
//         console.error(`Error fetching data for ${dateString}: ${err}`);
//         return {
//           date: dateString,
//           error: 'Failed to retrieve data',
//         };
//       }
//     })
//   );

//   // Return the finished results
//   return json(results);
// }) satisfies RequestHandler;