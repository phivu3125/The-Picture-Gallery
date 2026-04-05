import { Leva } from "leva";
import ObjectInspector from "./ObjectInspector";

/**
 * Dev-only toolbar — bundles Leva panel, ObjectInspector, and
 * any future dev tools in a single dynamic-import boundary.
 * App.tsx lazy-loads this only when import.meta.env.DEV is true,
 * so Vite tree-shakes the entire module (including leva) from production.
 */
export default function DevTools() {
	return (
		<>
			<Leva collapsed={false} />
			<ObjectInspector />
		</>
	);
}
