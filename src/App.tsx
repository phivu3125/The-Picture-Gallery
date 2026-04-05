import {
	GizmoHelper,
	GizmoViewport,
	Grid,
	OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { useSceneStore } from "./store/scene";

export default function App() {
	const selectObject = useSceneStore((s) => s.selectObject);

	return (
		<Canvas
			camera={{ position: [5, 5, 5], fov: 50 }}
			onPointerMissed={() => selectObject(null)}
		>
			<ambientLight intensity={0.5} />
			<directionalLight position={[5, 10, 5]} intensity={1} castShadow />

			<Scene />

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
	);
}
