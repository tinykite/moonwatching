import { json } from '@sveltejs/kit';
import { supabasePrivate } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async () => {
	const { data: subscribers, error: supabaseError } = await supabasePrivate
		.from('subscribers')
		.select('email');

	if (supabaseError) {
		throw error(404, supabaseError?.message ?? 'There was an error connecting to the database');
	}

	return json(subscribers);
}) satisfies RequestHandler;
