import { useControls } from "leva";
import { useEffect } from "react";
import { useSceneStore } from "../store/scene";
import type { TransformMode } from "../types/scene";

function handleChange(
	prop: "position" | "rotation" | "scale",
	index: number,
	value: number,
) {
	const { selectedId, objects, updateTransform } = useSceneStore.getState();
	if (!selectedId) return;
	const cur = objects.find((o) => o.id === selectedId);
	if (!cur) return;
	const arr = [...cur[prop]] as [number, number, number];
	arr[index] = value;
	updateTransform(selectedId, prop, arr);
}

function fmt(n: number) {
	return n.toFixed(2);
}

export default function ObjectInspector() {
	const selectedId = useSceneStore((s) => s.selectedId);
	const objects = useSceneStore((s) => s.objects);

	const selected = selectedId
		? (objects.find((o) => o.id === selectedId) ?? null)
		: null;

	// Info + mode
	const [, setInfo] = useControls("Inspector", () => ({
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
	}));

	// Position
	const [, setPos] = useControls("Position", () => ({
		x: {
			value: 0,
			step: 0.1,
			onChange: (v: number) => handleChange("position", 0, v),
		},
		y: {
			value: 0,
			step: 0.1,
			onChange: (v: number) => handleChange("position", 1, v),
		},
		z: {
			value: 0,
			step: 0.1,
			onChange: (v: number) => handleChange("position", 2, v),
		},
	}));

	// Rotation
	const [, setRot] = useControls("Rotation", () => ({
		x: {
			value: 0,
			step: 0.05,
			onChange: (v: number) => handleChange("rotation", 0, v),
		},
		y: {
			value: 0,
			step: 0.05,
			onChange: (v: number) => handleChange("rotation", 1, v),
		},
		z: {
			value: 0,
			step: 0.05,
			onChange: (v: number) => handleChange("rotation", 2, v),
		},
	}));

	// Scale
	const [, setScale] = useControls("Scale", () => ({
		x: {
			value: 1,
			step: 0.1,
			min: 0.1,
			onChange: (v: number) => handleChange("scale", 0, v),
		},
		y: {
			value: 1,
			step: 0.1,
			min: 0.1,
			onChange: (v: number) => handleChange("scale", 1, v),
		},
		z: {
			value: 1,
			step: 0.1,
			min: 0.1,
			onChange: (v: number) => handleChange("scale", 2, v),
		},
	}));

	// Sync store → Leva
	useEffect(() => {
		if (selected) {
			setInfo({ name: selected.name });
			setPos({
				x: selected.position[0],
				y: selected.position[1],
				z: selected.position[2],
			});
			setRot({
				x: selected.rotation[0],
				y: selected.rotation[1],
				z: selected.rotation[2],
			});
			setScale({
				x: selected.scale[0],
				y: selected.scale[1],
				z: selected.scale[2],
			});
		} else {
			setInfo({ name: "(none)" });
			setPos({ x: 0, y: 0, z: 0 });
			setRot({ x: 0, y: 0, z: 0 });
			setScale({ x: 1, y: 1, z: 1 });
		}
	}, [
		selectedId,
		selected?.position,
		selected?.rotation,
		selected?.scale,
		setInfo,
		setPos,
		setRot,
		setScale,
	]);

	if (!selected) return null;

	const copyText = `position={[${fmt(selected.position[0])}, ${fmt(selected.position[1])}, ${fmt(selected.position[2])}]}
rotation={[${fmt(selected.rotation[0])}, ${fmt(selected.rotation[1])}, ${fmt(selected.rotation[2])}]}
scale={[${fmt(selected.scale[0])}, ${fmt(selected.scale[1])}, ${fmt(selected.scale[2])}]}`;

	return (
		<div
			onClick={() => navigator.clipboard.writeText(copyText)}
			style={{
				position: "fixed",
				bottom: 16,
				right: 16,
				background: "#1a1a2e",
				color: "#7fdbca",
				padding: "12px 16px",
				borderRadius: 8,
				fontFamily: "monospace",
				fontSize: 12,
				cursor: "pointer",
				border: "1px solid #333",
				whiteSpace: "pre",
				zIndex: 1000,
			}}
		>
			<div style={{ color: "#888", fontSize: 10, marginBottom: 4 }}>
				Click to copy
			</div>
			{copyText}
		</div>
	);
}
