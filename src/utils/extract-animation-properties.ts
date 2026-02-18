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

	const {
		translateX,
		translateY,
		scaleX,
		scaleY,
		scale,
		skewX,
		skewY,
		skew,
		rotation,
		...rest
	} = props;
	const transform: BaseTransformProps[] = [];

	if (translateX) {
		transform.push({ translateX: translateX });
	}

	if (translateY) {
		transform.push({ translateY: translateY });
	}

	if (scaleX) {
		transform.push({ scaleX: scaleX });
	}

	if (scaleY) {
		transform.push({ scaleY: scaleY });
	}

	if (scale) {
		transform.push({ scaleY: scale, scaleX: scale });
	}

	if (skewX) {
		transform.push({ skewX: skewX });
	}

	if (skewY) {
		transform.push({ skewY: skewY });
	}

	if (skew) {
		transform.push({ skewX: skew, skewY: skewY });
	}

	if (rotation) {
		transform.push({ rotate: rotation });
	}

	return { ...rest, transform };
}
