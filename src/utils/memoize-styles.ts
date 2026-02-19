// utils/memoize-styles.ts
import type { ViewStyle } from "react-native";

// biome-ignore lint/suspicious/noExplicitAny: Catchall
type AnyObject = Record<string, any>;

type CacheEntry = {
	key: string;
	style: AnyObject;
};

// Global cache: hash → { key, style }
const styleCache = new Map<number, CacheEntry>();

let GlobalObjectId = 0; // For assigning stable IDs to nested objects
const ObjectIds = new WeakMap<object, number>();

/**
 * Simple, fast hash function for 32-bit integer
 */
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return hash >>> 0; // Ensure positive
}

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
 * High-performance memoizeStyle with hash-based lookup and collision detection
 * Uses a fast hash for primary lookup, but verifies the key to catch collisions
 */
export function memoizeStyle<T extends ViewStyle>(obj: T): T {
	// Build deterministic key by sorting and joining prop:value pairs
	const key = Object.entries(obj)
		.map(([k, v]) => `${k}:${valueKey(v)}`)
		.join(";");

	// Fast hash-based lookup
	const hash = hashString(key);
	const cached = styleCache.get(hash);

	// Verify cache hit (collision detection)
	if (cached && cached.key === key) {
		return cached.style as T;
	}

	// Cache miss or collision: create and store new style
	const style = Object.freeze({ ...obj }) as T;
	styleCache.set(hash, { key, style });

	return style;
}
