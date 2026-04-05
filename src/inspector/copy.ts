import type { SceneObjectData } from "../types/scene";

/* ── Formatting ──────────────────────────────────────────────── */

function fmt(n: number): string {
	return n.toFixed(2);
}

/**
 * Format a single vec3 prop as JSX-style attribute string.
 * Example: `position={[1.00, 2.00, 3.00]}`
 */
export function formatVec3Prop(
	name: string,
	value: [number, number, number],
): string {
	return `${name}={[${fmt(value[0])}, ${fmt(value[1])}, ${fmt(value[2])}]}`;
}

/**
 * Format all transform props (position, rotation, scale) as a JSX snippet.
 */
export function formatTransformBundle(obj: SceneObjectData): string {
	return [
		formatVec3Prop("position", obj.position),
		formatVec3Prop("rotation", obj.rotation),
		formatVec3Prop("scale", obj.scale),
	].join("\n");
}

/* ── Clipboard ───────────────────────────────────────────────── */

export function copyToClipboard(text: string): void {
	navigator.clipboard.writeText(text).catch(() => {
		// Clipboard API may fail on HTTP or in unsupported contexts
		console.warn("[inspector] clipboard write failed");
	});
}
