import { useHelper } from "@react-three/drei";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";
import { BoxHelper } from "three";
import { IS_DEV } from "../inspector/constants";
import {
	registerMeshRef,
	unregisterMeshRef,
	useSceneStore,
} from "../store/scene";
import type { SceneObjectData } from "../types/scene";

const GEOMETRIES = {
	box: <boxGeometry args={[1, 1, 1]} />,
	sphere: <sphereGeometry args={[0.75, 32, 32]} />,
	torus: <torusGeometry args={[0.5, 0.2, 16, 32]} />,
	cylinder: <cylinderGeometry args={[0.5, 0.5, 1, 32]} />,
	cone: <coneGeometry args={[0.5, 1, 32]} />,
} as const;

interface SceneObjectProps {
	data: SceneObjectData;
}

export default function SceneObject({ data }: SceneObjectProps) {
	const meshRef = useRef<Mesh>(null!);
	const selectedId = useSceneStore((s) => s.selectedId);
	const selectObject = useSceneStore((s) => s.selectObject);
	const isSelected = selectedId === data.id;

	// Register mesh ref for gizmo access — dev-only
	useEffect(() => {
		if (!IS_DEV) return;
		if (meshRef.current) {
			registerMeshRef(data.id, meshRef.current);
		}
		return () => unregisterMeshRef(data.id);
	}, [data.id]);

	// Selection highlight — dev-only
	useHelper(IS_DEV && isSelected ? meshRef : null, BoxHelper, "cyan");

	return (
		<mesh
			ref={meshRef}
			position={data.position}
			rotation={data.rotation}
			scale={data.scale}
			onClick={
				IS_DEV
					? (e) => {
							e.stopPropagation();
							selectObject(data.id);
						}
					: undefined
			}
		>
			{GEOMETRIES[data.geometry]}
			<meshStandardMaterial
				color={data.color}
				emissive={IS_DEV && isSelected ? data.color : "#000000"}
				emissiveIntensity={IS_DEV && isSelected ? 0.15 : 0}
			/>
		</mesh>
	);
}
