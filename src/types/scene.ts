import type * as THREE from "three";

export interface SceneObjectData {
	id: string;
	name: string;
	geometry: "box" | "sphere" | "torus" | "cylinder" | "cone";
	color: string;
	position: [number, number, number];
	rotation: [number, number, number];
	scale: [number, number, number];
}

export type GizmoType = "transform" | "pivot";
export type TransformMode = "translate" | "rotate" | "scale";

export interface SceneObjectRef {
	id: string;
	object: THREE.Object3D;
}
