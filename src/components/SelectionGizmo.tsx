import { PivotControls, TransformControls } from "@react-three/drei";
import { useCallback } from "react";
import type { Matrix4 } from "three";
import { getMeshRef, useSceneStore } from "../store/scene";

export default function SelectionGizmo() {
	const selectedId = useSceneStore((s) => s.selectedId);
	const gizmoType = useSceneStore((s) => s.gizmoType);
	const transformMode = useSceneStore((s) => s.transformMode);
	const updateTransform = useSceneStore((s) => s.updateTransform);
	const objects = useSceneStore((s) => s.objects);

	const selected = objects.find((o) => o.id === selectedId);
	const meshObj = selectedId ? getMeshRef(selectedId) : undefined;

	// Sync transform from gizmo back to store
	const syncTransformToStore = useCallback(() => {
		if (!selectedId || !meshObj) return;
		const pos = meshObj.position;
		const rot = meshObj.rotation;
		const sc = meshObj.scale;
		updateTransform(selectedId, "position", [pos.x, pos.y, pos.z]);
		updateTransform(selectedId, "rotation", [rot.x, rot.y, rot.z]);
		updateTransform(selectedId, "scale", [sc.x, sc.y, sc.z]);
	}, [selectedId, meshObj, updateTransform]);

	// Handle PivotControls drag
	const handlePivotDrag = useCallback(
		(_local: Matrix4, _deltaL: Matrix4, _world: Matrix4, _deltaW: Matrix4) => {
			if (!selectedId || !meshObj) return;
			// PivotControls applies transform to children directly
			// Read back after frame update
			requestAnimationFrame(() => {
				const pos = meshObj.position;
				const rot = meshObj.rotation;
				const sc = meshObj.scale;
				updateTransform(selectedId, "position", [pos.x, pos.y, pos.z]);
				updateTransform(selectedId, "rotation", [rot.x, rot.y, rot.z]);
				updateTransform(selectedId, "scale", [sc.x, sc.y, sc.z]);
			});
		},
		[selectedId, meshObj, updateTransform],
	);

	if (!selected || !meshObj) return null;

	if (gizmoType === "transform") {
		return (
			<TransformControls
				object={meshObj}
				mode={transformMode}
				onObjectChange={syncTransformToStore}
			/>
		);
	}

	// PivotControls mode
	return (
		<PivotControls
			anchor={[0, 0, 0]}
			depthTest={false}
			lineWidth={2}
			scale={1.5}
			onDrag={handlePivotDrag}
		>
			{/* PivotControls needs a child to wrap */}
		</PivotControls>
	);
}
