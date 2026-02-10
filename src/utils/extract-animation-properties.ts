import type { AnimationViewStyle, ViewAnimation } from "../models";

function hasTransformProperties(
	props: ViewAnimation,
): props is Partial<AnimationViewStyle> {
	return (
		!!props.translateX ||
		!!props.translateY ||
		!!props.scaleX ||
		!!props.scaleY ||
		!!props.scale ||
		!!props.skewX ||
		!!props.skewY ||
		!!props.rotation
	);
}

export function extractAnimationProperties<
	Keys extends keyof AnimationViewStyle,
>(props: ViewAnimation<Keys> | undefined) {
	if (!props) return undefined;

	const mapped = { ...props };

	// Map translate
	if (hasTransformProperties(mapped)) {
		const transforms = [];
		if (mapped.translateX) {
			transforms.push({ translateX: mapped.translateX });
			delete mapped.translateX;
		}

		if (mapped.translateY) {
			transforms.push({ translateY: mapped.translateY });
			delete mapped.translateY;
		}

		if (mapped.scaleX) {
			transforms.push({ scaleX: mapped.scaleX });
			delete mapped.scaleX;
		}

		if (mapped.scaleY) {
			transforms.push({ scaleY: mapped.scaleY });
			delete mapped.scaleY;
		}

		if (mapped.rotation) {
			transforms.push({ rotate: mapped.rotation });
			delete mapped.rotation;
		}
	}

	return mapped;
}
