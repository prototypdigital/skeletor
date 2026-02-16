// utils/memoize-styles.ts
import type { ViewStyle } from "react-native";

// biome-ignore lint/suspicious/noExplicitAny: Catchall
type AnyObject = Record<string, any>;

// Global cache: key → canonical style object
const styleCache = new Map<string, AnyObject>();

let GlobalObjectId = 0; // For assigning stable IDs to nested objects
const ObjectIds = new WeakMap<object, number>();

/**
 * Generate a stable, fast key for a value:
 * - primitives → string
 * - objects → unique ID (memoized)
 */
function valueKey(value: unknown): string {
	if (value && typeof value === "object") {
		if (!ObjectIds.has(value as object)) {
			GlobalObjectId += 1;
			ObjectIds.set(value as object, GlobalObjectId);
		}
		return `ref#${ObjectIds.get(value as object)}`;
	}
	return String(value);
}

/**
 * High-performance memoizeStyle function
 */
export function memoizeStyle<T extends ViewStyle>(obj: T): T {
	// Build key by joining prop:value pairs
	const key = Object.entries(obj)
		.map(([k, v]) => `${k}:${valueKey(v)}`)
		.join(";");

	// Return cached style if it exists
	let cached = styleCache.get(key) as T;
	if (!cached) {
		cached = Object.freeze({ ...obj });
		styleCache.set(key, cached);
	}

	return cached;
}
