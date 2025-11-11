import type {
	MatrixTransform,
	RotateTransform,
	RotateXTransform,
	RotateYTransform,
	RotateZTransform,
	ScaleTransform,
	ScaleXTransform,
	ScaleYTransform,
	SkewXTransform,
	SkewYTransform,
	TranslateXTransform,
	TranslateYTransform,
} from "react-native";
import type { AnimationViewStyle, ViewAnimation } from "../models";

type BaseTransformStyles =
	| RotateTransform
	| RotateXTransform
	| RotateYTransform
	| RotateZTransform
	| ScaleTransform
	| ScaleXTransform
	| ScaleYTransform
	| TranslateXTransform
	| TranslateYTransform
	| SkewXTransform
	| SkewYTransform
	| MatrixTransform;

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
		transform: BaseTransformStyles[];
	} = {
		...props,
		transform: [],
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
