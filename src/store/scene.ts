import type { Object3D } from "three";
import { create } from "zustand";
import type { GizmoType, SceneObjectData, TransformMode } from "../types/scene";

// Ref registry — lives outside React to avoid re-renders
const meshRefMap = new Map<string, Object3D>();

export function registerMeshRef(id: string, obj: Object3D) {
	meshRefMap.set(id, obj);
}

export function unregisterMeshRef(id: string) {
	meshRefMap.delete(id);
}

export function getMeshRef(id: string): Object3D | undefined {
	return meshRefMap.get(id);
}

// Store original positions for reset
const originalTransforms = new Map<
	string,
	{
		position: [number, number, number];
		rotation: [number, number, number];
		scale: [number, number, number];
	}
>();

interface SceneState {
	objects: SceneObjectData[];
	selectedId: string | null;
	gizmoType: GizmoType;
	transformMode: TransformMode;

	selectObject: (id: string | null) => void;
	updateTransform: (
		id: string,
		property: "position" | "rotation" | "scale",
		value: [number, number, number],
	) => void;
	batchUpdateTransform: (
		id: string,
		transforms: {
			position: [number, number, number];
			rotation: [number, number, number];
			scale: [number, number, number];
		},
	) => void;
	setGizmoType: (type: GizmoType) => void;
	setTransformMode: (mode: TransformMode) => void;
	resetTransform: (id: string) => void;
}

const DEFAULT_OBJECTS: SceneObjectData[] = [
	{
		id: "box-1",
		name: "Box",
		geometry: "box",
		color: "#ff6b35",
		position: [-2, 0.5, 0],
		rotation: [0, 0, 0],
		scale: [1, 1, 1],
	},
	{
		id: "sphere-1",
		name: "Sphere",
		geometry: "sphere",
		color: "#4ecdc4",
		position: [0, 0.75, 0],
		rotation: [0, 0, 0],
		scale: [1, 1, 1],
	},
	{
		id: "torus-1",
		name: "Torus",
		geometry: "torus",
		color: "#ffe66d",
		position: [2, 0.5, 0],
		rotation: [0, 0, 0],
		scale: [1, 1, 1],
	},
];

// Cache originals on init
for (const obj of DEFAULT_OBJECTS) {
	originalTransforms.set(obj.id, {
		position: [...obj.position],
		rotation: [...obj.rotation],
		scale: [...obj.scale],
	});
}

export const useSceneStore = create<SceneState>()((set) => ({
	objects: DEFAULT_OBJECTS,
	selectedId: null,
	gizmoType: "transform",
	transformMode: "translate",

	selectObject: (id) => set({ selectedId: id }),

	updateTransform: (id, property, value) =>
		set((state) => ({
			objects: state.objects.map((obj) =>
				obj.id === id ? { ...obj, [property]: value } : obj,
			),
		})),

	batchUpdateTransform: (id, transforms) =>
		set((state) => ({
			objects: state.objects.map((obj) =>
				obj.id === id
					? {
							...obj,
							position: transforms.position,
							rotation: transforms.rotation,
							scale: transforms.scale,
						}
					: obj,
			),
		})),

	setGizmoType: (type) => set({ gizmoType: type }),
	setTransformMode: (mode) => set({ transformMode: mode }),

	resetTransform: (id) =>
		set((state) => {
			const original = originalTransforms.get(id);
			if (!original) return state;
			return {
				objects: state.objects.map((obj) =>
					obj.id === id
						? {
								...obj,
								position: [...original.position] as [number, number, number],
								rotation: [...original.rotation] as [number, number, number],
								scale: [...original.scale] as [number, number, number],
							}
						: obj,
				),
			};
		}),
}));
