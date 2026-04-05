/**
 * Dev-only flag — Vite replaces import.meta.env.DEV at build time,
 * enabling tree-shaking of all dev-only inspector code in production.
 */
export const IS_DEV = import.meta.env.DEV;

/* ── Transform field configuration ─────────────────────────────── */

export interface FieldConfig {
	step: number;
	min?: number;
	defaultValue: number;
}

export const POSITION_CONFIG: FieldConfig = {
	step: 0.1,
	defaultValue: 0,
};

export const ROTATION_CONFIG: FieldConfig = {
	step: 0.05,
	defaultValue: 0,
};

export const SCALE_CONFIG: FieldConfig = {
	step: 0.1,
	min: 0.1,
	defaultValue: 1,
};
