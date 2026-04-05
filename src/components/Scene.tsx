import { useSceneStore } from "../store/scene";
import SceneObject from "./SceneObject";

export default function Scene() {
	const objects = useSceneStore((s) => s.objects);

	return (
		<>
			{objects.map((obj) => (
				<SceneObject key={obj.id} data={obj} />
			))}
		</>
	);
}
