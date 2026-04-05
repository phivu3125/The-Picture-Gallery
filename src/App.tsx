import { Canvas } from "@react-three/fiber";

export default function App() {
	return (
		<Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
			<ambientLight intensity={0.5} />
			<directionalLight position={[5, 10, 5]} intensity={1} />
			<mesh position={[0, 0.5, 0]}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial color="orange" />
			</mesh>
		</Canvas>
	);
}
