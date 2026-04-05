import { useControls } from "leva";
import { useEffect } from "react";
import { useSceneStore } from "../store/scene";
import {
	copyAllSection,
	infoSection,
	positionSection,
	rotationSection,
	scaleSection,
} from "./sections";

export default function ObjectInspector() {
	const selectedId = useSceneStore((s) => s.selectedId);
	const objects = useSceneStore((s) => s.objects);

	const selected = selectedId
		? (objects.find((o) => o.id === selectedId) ?? null)
		: null;

	const [, setInfo] = useControls("Inspector", () => ({
		...infoSection(),
		...copyAllSection(),
	}));

	const [, setPos] = useControls("Position", positionSection);
	const [, setRot] = useControls("Rotation", rotationSection);
	const [, setScale] = useControls("Scale", scaleSection);

	// Sync store → Leva
	useEffect(() => {
		if (selected) {
			setInfo({ name: selected.name });
			setPos({
				x: selected.position[0],
				y: selected.position[1],
				z: selected.position[2],
			});
			setRot({
				x: selected.rotation[0],
				y: selected.rotation[1],
				z: selected.rotation[2],
			});
			setScale({
				x: selected.scale[0],
				y: selected.scale[1],
				z: selected.scale[2],
			});
		} else {
			setInfo({ name: "(none)" });
			setPos({ x: 0, y: 0, z: 0 });
			setRot({ x: 0, y: 0, z: 0 });
			setScale({ x: 1, y: 1, z: 1 });
		}
	}, [
		selectedId,
		selected?.position,
		selected?.rotation,
		selected?.scale,
		setInfo,
		setPos,
		setRot,
		setScale,
	]);

	return null;
}
