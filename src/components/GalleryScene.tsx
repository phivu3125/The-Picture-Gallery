import { useAnimations, useGLTF } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import type { Group } from "three";
import { Box3, Vector3 } from "three";

const MODEL_PATH = "/models/scene-draco.glb";
const SCALE = 10;

export default function GalleryScene() {
	const groupRef = useRef<Group>(null!);
	const { scene, animations } = useGLTF(MODEL_PATH, true);
	const { actions } = useAnimations(animations, groupRef);

	// Log bounding box (after scale) — check browser console then remove
	useEffect(() => {
		const box = new Box3().setFromObject(groupRef.current);
		const center = new Vector3();
		const size = new Vector3();
		box.getCenter(center);
		box.getSize(size);
		console.log("=== ROOM BOUNDING BOX (scaled) ===");
		console.log(
			"min:",
			box.min.toArray().map((v) => +v.toFixed(2)),
		);
		console.log(
			"max:",
			box.max.toArray().map((v) => +v.toFixed(2)),
		);
		console.log(
			"center:",
			center.toArray().map((v) => +v.toFixed(2)),
		);
		console.log(
			"size:",
			size.toArray().map((v) => +v.toFixed(2)),
		);
	}, [scene]);

	// Play all animations on mount
	useEffect(() => {
		for (const action of Object.values(actions)) {
			action?.play();
		}
	}, [actions]);

	// DEV HELPER: Click anywhere on model → log 3D position + normal
	// Use this to find hotspot positions, then remove
	const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
		e.stopPropagation();
		const point = e.point;
		const normal = e.face?.normal;
		const meshName = e.object.name || "(unnamed)";

		console.log("=== CLICK POINT ===");
		console.log("mesh:", meshName);
		console.log(
			"point:",
			point.toArray().map((v) => +v.toFixed(3)),
		);
		if (normal) {
			console.log(
				"normal:",
				normal.toArray().map((v) => +v.toFixed(3)),
			);
			// Camera position = point + normal * offset (step back from surface)
			const camPos = point
				.clone()
				.addScaledVector(
					normal.clone().transformDirection(e.object.matrixWorld),
					0.8,
				);
			console.log(
				"suggested camera:",
				camPos.toArray().map((v) => +v.toFixed(3)),
			);
		}
		console.log("---");
	}, []);

	return (
		<group ref={groupRef} onClick={handleClick}>
			<primitive object={scene} scale={SCALE} />
		</group>
	);
}

useGLTF.preload(MODEL_PATH, true);
