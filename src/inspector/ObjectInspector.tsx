import { button, folder, useControls } from "leva";
import { useSceneStore } from "../store/scene";
import type { GizmoType, TransformMode } from "../types/scene";

export default function ObjectInspector() {
	const selectedId = useSceneStore((s) => s.selectedId);
	const objects = useSceneStore((s) => s.objects);
	const updateTransform = useSceneStore((s) => s.updateTransform);
	const gizmoType = useSceneStore((s) => s.gizmoType);
	const setGizmoType = useSceneStore((s) => s.setGizmoType);
	const transformMode = useSceneStore((s) => s.transformMode);
	const setTransformMode = useSceneStore((s) => s.setTransformMode);
	const resetTransform = useSceneStore((s) => s.resetTransform);

	const selected = objects.find((o) => o.id === selectedId) ?? null;

	useControls(
		"Selected Object",
		() => ({
			name: { value: selected?.name ?? "(none)", editable: false },
			"Gizmo Type": {
				value: gizmoType,
				options: {
					Transform: "transform" as GizmoType,
					Pivot: "pivot" as GizmoType,
				},
				onChange: (v: GizmoType) => setGizmoType(v),
				render: () => selected !== null,
			},
			"Transform Mode": {
				value: transformMode,
				options: {
					Translate: "translate" as TransformMode,
					Rotate: "rotate" as TransformMode,
					Scale: "scale" as TransformMode,
				},
				onChange: (v: TransformMode) => setTransformMode(v),
				render: () => selected !== null,
			},
			Position: folder(
				{
					posX: {
						value: selected?.position[0] ?? 0,
						step: 0.1,
						label: "X",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "position", [
									v,
									obj.position[1],
									obj.position[2],
								]);
						},
					},
					posY: {
						value: selected?.position[1] ?? 0,
						step: 0.1,
						label: "Y",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "position", [
									obj.position[0],
									v,
									obj.position[2],
								]);
						},
					},
					posZ: {
						value: selected?.position[2] ?? 0,
						step: 0.1,
						label: "Z",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "position", [
									obj.position[0],
									obj.position[1],
									v,
								]);
						},
					},
				},
				{ collapsed: false, render: () => selected !== null },
			),
			Rotation: folder(
				{
					rotX: {
						value: selected?.rotation[0] ?? 0,
						step: 0.05,
						min: -Math.PI,
						max: Math.PI,
						label: "X",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "rotation", [
									v,
									obj.rotation[1],
									obj.rotation[2],
								]);
						},
					},
					rotY: {
						value: selected?.rotation[1] ?? 0,
						step: 0.05,
						min: -Math.PI,
						max: Math.PI,
						label: "Y",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "rotation", [
									obj.rotation[0],
									v,
									obj.rotation[2],
								]);
						},
					},
					rotZ: {
						value: selected?.rotation[2] ?? 0,
						step: 0.05,
						min: -Math.PI,
						max: Math.PI,
						label: "Z",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "rotation", [
									obj.rotation[0],
									obj.rotation[1],
									v,
								]);
						},
					},
				},
				{ collapsed: true, render: () => selected !== null },
			),
			Scale: folder(
				{
					scX: {
						value: selected?.scale[0] ?? 1,
						step: 0.1,
						min: 0.1,
						max: 10,
						label: "X",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "scale", [
									v,
									obj.scale[1],
									obj.scale[2],
								]);
						},
					},
					scY: {
						value: selected?.scale[1] ?? 1,
						step: 0.1,
						min: 0.1,
						max: 10,
						label: "Y",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "scale", [
									obj.scale[0],
									v,
									obj.scale[2],
								]);
						},
					},
					scZ: {
						value: selected?.scale[2] ?? 1,
						step: 0.1,
						min: 0.1,
						max: 10,
						label: "Z",
						onChange: (v: number) => {
							if (!selectedId) return;
							const obj = useSceneStore
								.getState()
								.objects.find((o) => o.id === selectedId);
							if (obj)
								updateTransform(selectedId, "scale", [
									obj.scale[0],
									obj.scale[1],
									v,
								]);
						},
					},
				},
				{ collapsed: true, render: () => selected !== null },
			),
			"Reset Transform": button(
				() => {
					if (selectedId) resetTransform(selectedId);
				},
				{ disabled: !selected },
			),
		}),
		{ collapsed: !selected },
		[
			selectedId,
			selected?.position,
			selected?.rotation,
			selected?.scale,
			gizmoType,
			transformMode,
		],
	);

	return null;
}
