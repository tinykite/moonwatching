import { json } from '@sveltejs/kit';
import { supabasePrivate } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

export async function GET() {
	const { data: subscribers, error: supabaseError } = await supabasePrivate
		.from('subscribers')
		.select('email');

	if (supabaseError) {
		throw error(404, supabaseError?.message ?? 'There was an error connecting to the database');
	}

	return json(subscribers);
}
