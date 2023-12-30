
import {createHash} from 'crypto'

function getHashFromStringNode(str: string) {
  return createHash('sha256').update(str).digest('hex');
}

async function getHashFromString(str: string) {
	const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
	return Array.prototype.map.call(new Uint8Array(buf), x=>(('00'+x.toString(16)).slice(-2))).join('');
}


export {getHashFromStringNode, getHashFromString}