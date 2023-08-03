import { expect, test } from 'vitest';
import { validateEmail } from './forms';

test('validates correctly formatted email', () => {
	expect(validateEmail('friend@toast.com')).toBe(true);
});

test('validates incorrectly formatted email', () => {
	expect(validateEmail('   lud@woo.com')).toBe(false);
	expect(validateEmail('adam')).toBe(false);
	expect(validateEmail('test')).toBe(false);
	expect(validateEmail('toast@avocado')).toBe(false);
	expect(validateEmail('avocado@nud.')).toBe(false);
	expect(validateEmail('linda@')).toBe(false);
	expect(validateEmail('@toast')).toBe(false);
});
