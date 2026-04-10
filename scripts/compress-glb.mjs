/**
 * Optimize GLB with meshopt compression.
 * Key fix: quantizationVolume="scene" ensures all meshes share
 * the same quantization grid → no cracks at mesh boundaries.
 *
 * Usage: node scripts/compress-glb.mjs
 */

import { NodeIO } from "@gltf-transform/core";
import {
	EXTMeshoptCompression,
	KHRMeshQuantization,
} from "@gltf-transform/extensions";
import { reorder, meshopt, dedup, prune } from "@gltf-transform/functions";
import { MeshoptEncoder } from "meshoptimizer";
import { statSync } from "node:fs";

const INPUT = "public/models/scene.glb";
const OUTPUT_SCENE_Q = "public/models/scene-compressed.glb";

await MeshoptEncoder.ready;

const io = new NodeIO()
	.registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
	.registerDependencies({ 'meshopt.encoder': MeshoptEncoder });

console.log("Reading", INPUT, "...");
const document = await io.read(INPUT);

// Dedup + Prune (lossless)
console.log("Dedup + Prune...");
await document.transform(dedup(), prune());

// Reorder vertices for GPU cache (lossless)
console.log("Reordering...");
await document.transform(reorder({ encoder: MeshoptEncoder }));

// Meshopt with scene-level quantization grid
// This is the key: all meshes share the same grid → shared boundary
// vertices get identical quantized values → NO cracks
console.log("Meshopt compression (scene-level quantization)...");
await document.transform(
	meshopt({
		encoder: MeshoptEncoder,
		level: "medium",
		quantizationVolume: "scene", // ← FIX: shared grid for all meshes
		quantizePosition: 16, // max precision allowed
		quantizeNormal: 12,
		quantizeTexcoord: 14,
	}),
);

// Register encoder on the extension for writing (already done via registerDependencies)
console.log("Writing", OUTPUT_SCENE_Q, "...");
await io.write(OUTPUT_SCENE_Q, document);

const inputSize = statSync(INPUT).size;
const outputSize = statSync(OUTPUT_SCENE_Q).size;
const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);

console.log(`\nDone!`);
console.log(`  Input:  ${(inputSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Output: ${(outputSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`  Reduction: ${reduction}%`);
console.log(
	`\nKey: quantizationVolume="scene" — all meshes share same grid.`,
);
console.log(`     This should eliminate cracks at mesh boundaries.`);
