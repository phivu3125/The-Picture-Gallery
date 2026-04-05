import {
	GizmoHelper,
	GizmoViewport,
	Grid,
	OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

export default function App() {
	return (
		<Canvas
			camera={{ position: [5, 5, 5], fov: 50 }}
			onPointerMissed={() => {}}
		>
			<ambientLight intensity={0.5} />
			<directionalLight position={[5, 10, 5]} intensity={1} castShadow />

			<mesh position={[-2, 0.5, 0]}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="#ff6b35" />
			</mesh>
			<mesh position={[0, 0.75, 0]}>
				<sphereGeometry args={[0.75, 32, 32]} />
				<meshStandardMaterial color="#4ecdc4" />
			</mesh>
			<mesh position={[2, 0.5, 0]}>
				<torusGeometry args={[0.5, 0.2, 16, 32]} />
				<meshStandardMaterial color="#ffe66d" />
			</mesh>

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
