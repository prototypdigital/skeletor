import type { AnimationViewStyle, ViewAnimation } from "models";
import type { TransformsStyle } from "react-native";

function hasTransformProperties<Keys extends keyof AnimationViewStyle>(
	props: ViewAnimation<Keys>,
) {
	return (
		props.translateX ||
		props.translateY ||
		props.scaleX ||
		props.scaleY ||
		props.scaleY ||
		props.rotation
	);
}

export function extractAnimationProperties<
	Keys extends keyof AnimationViewStyle,
>(props: ViewAnimation<Keys> | undefined) {
	if (!props) return undefined;

	const mapped: ViewAnimation<Keys> & {
		transform?: TransformsStyle["transform"];
	} = {
		...props,
	};

	// Map translate
	if (hasTransformProperties(props)) {
		mapped.transform = [];
		if (props.translateX) {
			mapped.transform.push({ translateX: props.translateX });
			delete mapped.translateX;
		}

		if (props.translateY) {
			mapped.transform.push({ translateY: props.translateY });
			delete mapped.translateY;
		}

		if (props.scaleX) {
			mapped.transform.push({ scaleX: props.scaleX });
			delete mapped.scaleX;
		}

		if (props.scaleY) {
			mapped.transform.push({ scaleY: props.scaleY });
			delete mapped.scaleY;
		}

		if (props.rotation) {
			mapped.transform.push({ rotate: props.rotation });
			delete mapped.rotation;
		}
	}

	return mapped;
}
