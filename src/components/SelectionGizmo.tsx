import { PivotControls, TransformControls } from "@react-three/drei";
import { useCallback } from "react";
import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { getMeshRef, useSceneStore } from "../store/scene";

// Reusable decomposition objects to avoid GC
const _position = new Vector3();
const _quaternion = new Quaternion();
const _scale = new Vector3();
const _euler = new Euler();
const _matrix = new Matrix4();

export default function SelectionGizmo() {
	const selectedId = useSceneStore((s) => s.selectedId);
	const gizmoType = useSceneStore((s) => s.gizmoType);
	const transformMode = useSceneStore((s) => s.transformMode);
	const batchUpdateTransform = useSceneStore((s) => s.batchUpdateTransform);
	const objects = useSceneStore((s) => s.objects);

	const selected = objects.find((o) => o.id === selectedId);
	const meshObj = selectedId ? getMeshRef(selectedId) : undefined;

	// Sync TransformControls changes back to store (single batch)
	const syncTransformToStore = useCallback(() => {
		if (!selectedId || !meshObj) return;
		const pos = meshObj.position;
		const rot = meshObj.rotation;
		const sc = meshObj.scale;
		batchUpdateTransform(selectedId, {
			position: [pos.x, pos.y, pos.z],
			rotation: [rot.x, rot.y, rot.z],
			scale: [sc.x, sc.y, sc.z],
		});
	}, [selectedId, meshObj, batchUpdateTransform]);

	// Handle PivotControls drag — decompose the world matrix
	const handlePivotDrag = useCallback(
		(worldMatrix: Matrix4) => {
			if (!selectedId || !meshObj) return;

			// Compute new world transform by combining parent inverse with pivot matrix
			// PivotControls onDrag gives the local matrix applied to the group
			// Since our PivotControls wraps the mesh, the local matrix IS the transform
			_matrix.copy(worldMatrix);
			_matrix.decompose(_position, _quaternion, _scale);
			_euler.setFromQuaternion(_quaternion);

			batchUpdateTransform(selectedId, {
				position: [_position.x, _position.y, _position.z],
				rotation: [_euler.x, _euler.y, _euler.z],
				scale: [_scale.x, _scale.y, _scale.z],
			});
		},
		[selectedId, meshObj, batchUpdateTransform],
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

	// PivotControls mode — wraps a visible proxy at the selected object's position
	return (
		<PivotControls
			anchor={[0, 0, 0]}
			offset={selected.position}
			depthTest={false}
			lineWidth={2}
			scale={1.5}
			autoTransform={false}
			onDrag={(local) => handlePivotDrag(local)}
			visible={true}
		>
			<group />
		</PivotControls>
	);
}
