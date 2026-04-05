import { button } from "leva";
import { useSceneStore } from "../store/scene";
import type { SceneObjectData, TransformMode } from "../types/scene";
import { POSITION_CONFIG, ROTATION_CONFIG, SCALE_CONFIG } from "./constants";
import { copyToClipboard, formatTransformBundle, formatVec3Prop } from "./copy";

/* ── Helpers ─────────────────────────────────────────────────── */

type Vec3Prop = "position" | "rotation" | "scale";

function handleChange(prop: Vec3Prop, index: number, value: number) {
	const { selectedId, objects, updateTransform } = useSceneStore.getState();
	if (!selectedId) return;
	const cur = objects.find((o) => o.id === selectedId);
	if (!cur) return;
	const arr = [...cur[prop]] as [number, number, number];
	arr[index] = value;
	updateTransform(selectedId, prop, arr);
}

/* ── Section: Info ───────────────────────────────────────────── */

export function infoSection() {
	return {
		name: { value: "(none)", editable: false },
		"Transform Mode": {
			value: "translate" as TransformMode,
			options: {
				Translate: "translate" as TransformMode,
				Rotate: "rotate" as TransformMode,
				Scale: "scale" as TransformMode,
			},
			onChange: (v: TransformMode) =>
				useSceneStore.getState().setTransformMode(v),
		},
	};
}

/* ── Section: Vec3 (Position / Rotation / Scale) ─────────────── */

interface Vec3SectionOptions {
	prop: Vec3Prop;
	step: number;
	min?: number;
	defaultValue: number;
}

function vec3Section({ prop, step, min, defaultValue }: Vec3SectionOptions) {
	return {
		x: {
			value: defaultValue,
			step,
			...(min !== undefined && { min }),
			onChange: (v: number) => handleChange(prop, 0, v),
		},
		y: {
			value: defaultValue,
			step,
			...(min !== undefined && { min }),
			onChange: (v: number) => handleChange(prop, 1, v),
		},
		z: {
			value: defaultValue,
			step,
			...(min !== undefined && { min }),
			onChange: (v: number) => handleChange(prop, 2, v),
		},
		[`📋 Copy ${prop.charAt(0).toUpperCase() + prop.slice(1)}`]: button(() => {
			const { selectedId, objects } = useSceneStore.getState();
			if (!selectedId) return;
			const obj = objects.find((o) => o.id === selectedId);
			if (!obj) return;
			copyToClipboard(formatVec3Prop(prop, obj[prop]));
		}),
	};
}

export function positionSection() {
	return vec3Section({ prop: "position", ...POSITION_CONFIG });
}

export function rotationSection() {
	return vec3Section({ prop: "rotation", ...ROTATION_CONFIG });
}

export function scaleSection() {
	return vec3Section({ prop: "scale", ...SCALE_CONFIG });
}

/* ── Section: Copy All ───────────────────────────────────────── */

export function copyAllSection() {
	return {
		"📋 Copy All Transform": button(() => {
			const { selectedId, objects } = useSceneStore.getState();
			if (!selectedId) return;
			const obj = objects.find((o) => o.id === selectedId) as
				| SceneObjectData
				| undefined;
			if (!obj) return;
			copyToClipboard(formatTransformBundle(obj));
		}),
	};
}
