import { TransformControls } from "@react-three/drei";
import { useCallback } from "react";
import { getMeshRef, useSceneStore } from "../store/scene";

export default function SelectionGizmo() {
	const selectedId = useSceneStore((s) => s.selectedId);
	const transformMode = useSceneStore((s) => s.transformMode);
	const updateTransform = useSceneStore((s) => s.updateTransform);

	const meshObj = selectedId ? getMeshRef(selectedId) : undefined;

	const syncToStore = useCallback(() => {
		if (!selectedId || !meshObj) return;
		const pos = meshObj.position;
		const rot = meshObj.rotation;
		const sc = meshObj.scale;
		updateTransform(selectedId, "position", [pos.x, pos.y, pos.z]);
		updateTransform(selectedId, "rotation", [rot.x, rot.y, rot.z]);
		updateTransform(selectedId, "scale", [sc.x, sc.y, sc.z]);
	}, [selectedId, meshObj, updateTransform]);

	if (!selectedId || !meshObj) return null;

	return (
		<TransformControls
			object={meshObj}
			mode={transformMode}
			onObjectChange={syncToStore}
		/>
	);
}
