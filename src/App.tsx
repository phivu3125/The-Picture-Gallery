import {
	GizmoHelper,
	GizmoViewport,
	Grid,
	OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { useEffect } from "react";
import Scene from "./components/Scene";
import SelectionGizmo from "./components/SelectionGizmo";
import ObjectInspector from "./inspector/ObjectInspector";
import { useSceneStore } from "./store/scene";

export default function App() {
	const selectObject = useSceneStore((s) => s.selectObject);

	// Escape to deselect — avoids onPointerMissed conflicts with gizmo
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") selectObject(null);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectObject]);

	return (
		<>
			<Leva collapsed={false} />
			<ObjectInspector />
			<Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
				<ambientLight intensity={0.5} />
				<directionalLight position={[5, 10, 5]} intensity={1} castShadow />

				<Scene />
				<SelectionGizmo />

				<Grid
					infiniteGrid
					cellSize={1}
					cellThickness={0.5}
					sectionSize={5}
					sectionThickness={1}
					fadeDistance={30}
					cellColor="#6e6e6e"
					sectionColor="#9d4b4b"
				/>
				<axesHelper args={[5]} />

				<GizmoHelper alignment="bottom-right" margin={[80, 80]}>
					<GizmoViewport />
				</GizmoHelper>

				<OrbitControls makeDefault />
			</Canvas>
		</>
	);
}
