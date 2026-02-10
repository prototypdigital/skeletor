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
import type {
	ComposedAnimationInterpolations,
	CustomAnimatableProperties,
} from "../models";

type BaseTransformProps =
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

export function extractAnimationProperties(
	props:
		| ComposedAnimationInterpolations<keyof CustomAnimatableProperties>
		| undefined,
) {
	if (!props) return undefined;

	const transform: BaseTransformProps[] = [];

	if (props.translateX) {
		transform.push({ translateX: props.translateX });
	}

	if (props.translateY) {
		transform.push({ translateY: props.translateY });
	}

	if (props.scaleX) {
		transform.push({ scaleX: props.scaleX });
	}

	if (props.scaleY) {
		transform.push({ scaleY: props.scaleY });
	}

	if (props.scale) {
		transform.push({ scaleY: props.scale, scaleX: props.scale });
	}

	if (props.skewX) {
		transform.push({ skewX: props.skewX });
	}

	if (props.skewY) {
		transform.push({ skewY: props.skewY });
	}

	if (props.skew) {
		transform.push({ skewX: props.skew, skewY: props.skewY });
	}

	if (props.rotation) {
		transform.push({ rotate: props.rotation });
	}

	return { ...props, transform };
}
