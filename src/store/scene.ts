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

	setGizmoType: (type) => set({ gizmoType: type }),
	setTransformMode: (mode) => set({ transformMode: mode }),

	resetTransform: (id) =>
		set((state) => ({
			objects: state.objects.map((obj) =>
				obj.id === id
					? {
							...obj,
							position: [0, 0.5, 0],
							rotation: [0, 0, 0],
							scale: [1, 1, 1],
						}
					: obj,
			),
		})),
}));
