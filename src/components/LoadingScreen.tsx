import { useProgress } from "@react-three/drei";

export default function LoadingScreen() {
	const { progress, active } = useProgress();

	// Fully loaded — fade out then unmount
	if (!active && progress >= 100) {
		return null;
	}

	const pct = Math.round(progress);

	return (
		<div
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 9999,
				background: "#0a0a0a",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: "20px",
				fontFamily: "system-ui, -apple-system, sans-serif",
				color: "white",
				transition: "opacity 0.6s ease",
				opacity: pct >= 100 ? 0 : 1,
				pointerEvents: pct >= 100 ? "none" : "auto",
			}}
		>
			{/* Title */}
			<h1
				style={{
					fontSize: "24px",
					fontWeight: 300,
					letterSpacing: "0.15em",
					textTransform: "uppercase",
					margin: 0,
					opacity: 0.9,
				}}
			>
				Gallery
			</h1>

			{/* Progress bar track */}
			<div
				style={{
					width: "min(280px, 60vw)",
					height: "3px",
					background: "rgba(255,255,255,0.1)",
					borderRadius: "2px",
					overflow: "hidden",
				}}
			>
				{/* Progress bar fill */}
				<div
					style={{
						width: `${pct}%`,
						height: "100%",
						background: "rgba(255,255,255,0.7)",
						borderRadius: "2px",
						transition: "width 0.3s ease",
					}}
				/>
			</div>

			{/* Percentage */}
			<span
				style={{
					fontSize: "13px",
					fontWeight: 400,
					opacity: 0.5,
					fontVariantNumeric: "tabular-nums",
				}}
			>
				{pct}%
			</span>
		</div>
	);
}
