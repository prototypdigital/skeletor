// utils/memoizeStyle.ts
type AnyObject = Record<string, any>;

const styleCache = new Map<string, AnyObject>();

export function memoizeStyle(obj: AnyObject): AnyObject {
	const key = Object.entries(obj)
		.sort(([a], [b]) => (a > b ? 1 : -1))
		.map(([k, v]) => `${k}:${JSON.stringify(v)}`)
		.join(";");

	let cached = styleCache.get(key);
	if (!cached) {
		cached = Object.freeze({ ...obj });
		styleCache.set(key, cached);
	}

	return cached;
}
