import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const GET: RequestHandler = async () => {
	// TODO: If number of moon images grow, query will need to be limited to a range
	const { data: images } = await supabase.from('images').select('*');

	if (!images) {
		throw error(404, 'No images found');
	}

	const randomImage = images[Math.floor(Math.random() * images.length)];

	// Don't return the id, which is only used to lookup the random image
	const { id, ...imageInfo } = randomImage;

	return json(imageInfo);
};
