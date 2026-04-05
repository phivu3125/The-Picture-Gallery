import {
	GizmoHelper,
	GizmoViewport,
	Grid,
	OrbitControls,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { lazy, Suspense, useEffect } from "react";
import Scene from "./components/Scene";
import SelectionGizmo from "./components/SelectionGizmo";
import { useSceneStore } from "./store/scene";

// Vite replaces `import.meta.env.DEV` with a literal boolean at build time.
// In production this becomes `false ? lazy(...) : null` — Rollup drops the
// dynamic import entirely so leva never enters the production bundle.
const DevTools = import.meta.env.DEV
	? lazy(() => import("./inspector/DevTools"))
	: null;

export default function App() {
	const selectObject = useSceneStore((s) => s.selectObject);

	// Escape to deselect — dev-only
	useEffect(() => {
		if (!import.meta.env.DEV) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") selectObject(null);
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectObject]);

	return (
		<>
			{DevTools && (
				<Suspense>
					<DevTools />
				</Suspense>
			)}
			<Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
				<ambientLight intensity={0.5} />
				<directionalLight position={[5, 10, 5]} intensity={1} castShadow />

				<Scene />
				{import.meta.env.DEV && <SelectionGizmo />}

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
