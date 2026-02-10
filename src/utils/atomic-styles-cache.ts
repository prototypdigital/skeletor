import type { ViewStyle } from "react-native";

// biome-ignore lint/complexity/noStaticOnlyClass: It's fine
export class AtomicStyleCache {
	private static _cache = new Map<
		keyof ViewStyle,
		Map<ViewStyle[keyof ViewStyle], ViewStyle[keyof ViewStyle]>
	>();

	public static cacheStyle(styles: Partial<ViewStyle>) {
		for (const key in styles) {
			const prop = key as keyof ViewStyle;
			const value = styles[prop];

			if (value === undefined) continue;

			let propCache = AtomicStyleCache._cache.get(prop);
			if (!propCache) {
				propCache = new Map();
				AtomicStyleCache._cache.set(prop, propCache);
			}

			// idempotent insert
			if (!propCache.has(value)) {
				propCache.set(value, value);
			}
		}
	}

	public static resolveAtomic<T extends Partial<ViewStyle>>(styles: T): T {
		const resolved = {} as T;

		for (const key in styles) {
			const prop = key as keyof ViewStyle;
			const value = styles[prop];

			if (value === undefined) continue;

			// Create the prop cache
			let propCache = AtomicStyleCache._cache.get(prop);
			if (!propCache) {
				propCache = new Map();
				AtomicStyleCache._cache.set(prop, propCache);
			}

			// Create the cached value
			let cached = propCache.get(value);
			if (!cached) {
				propCache.set(value, value);
				cached = value;
			}

			// Assign the value to the resolved style
			// biome-ignore lint/suspicious/noExplicitAny: I can't do the required type gymnastics
			(resolved as any)[prop] = cached;
		}

		return resolved;
	}

	public static getCachedStyle<T extends keyof ViewStyle>(
		prop: T,
		value: ViewStyle[T],
	) {
		return AtomicStyleCache._cache.get(prop)?.get(value);
	}
}
