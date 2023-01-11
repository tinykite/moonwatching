import * as postmark from 'postmark';
import { POSTMARK_KEY } from '$env/static/private';

export const postmarkClient = new postmark.ServerClient(POSTMARK_KEY);
