import type { HotspotData } from "./Hotspot";

interface InfoPanelProps {
	hotspot: HotspotData | null;
	onClose: () => void;
}

export default function InfoPanel({ hotspot, onClose }: InfoPanelProps) {
	return (
		<>
			{/* Desktop: right sidebar */}
			<div
				className="info-panel-desktop"
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					height: "100%",
					width: "340px",
					background: "rgba(0, 0, 0, 0.88)",
					color: "white",
					backdropFilter: "blur(16px)",
					borderLeft: "1px solid rgba(255,255,255,0.08)",
					zIndex: 100,
					transform: hotspot ? "translateX(0)" : "translateX(100%)",
					transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
					display: "flex",
					flexDirection: "column",
					fontFamily: "system-ui, -apple-system, sans-serif",
					pointerEvents: hotspot ? "auto" : "none",
				}}
			>
				{hotspot && <PanelContent hotspot={hotspot} onClose={onClose} />}
			</div>

			{/* Mobile: bottom sheet */}
			<div
				className="info-panel-mobile"
				style={{
					position: "absolute",
					bottom: "76px", // above navigator (44px + 24px bottom + 8px gap)
					left: 0,
					right: 0,
					maxHeight: "55vh",
					background: "rgba(0, 0, 0, 0.92)",
					color: "white",
					backdropFilter: "blur(16px)",
					borderTop: "1px solid rgba(255,255,255,0.08)",
					borderRadius: "16px 16px 0 0",
					zIndex: 100,
					transform: hotspot ? "translateY(0)" : "translateY(100%)",
					opacity: hotspot ? 1 : 0,
					transition:
						"transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
					display: "none", // hidden by default, shown via media query
					flexDirection: "column",
					fontFamily: "system-ui, -apple-system, sans-serif",
					pointerEvents: hotspot ? "auto" : "none",
					overflow: "hidden",
				}}
			>
				{hotspot && <PanelContent hotspot={hotspot} onClose={onClose} />}
			</div>

			{/* Responsive toggle: show desktop on wide, mobile on narrow */}
			<style>{`
				@media (max-width: 640px) {
					.info-panel-desktop { display: none !important; }
					.info-panel-mobile { display: flex !important; }
				}
				@media (min-width: 641px) {
					.info-panel-desktop { display: flex !important; }
					.info-panel-mobile { display: none !important; }
				}
			`}</style>
		</>
	);
}

function PanelContent({
	hotspot,
	onClose,
}: {
	hotspot: HotspotData;
	onClose: () => void;
}) {
	return (
		<>
			{/* Close button */}
			<button
				type="button"
				onClick={onClose}
				style={{
					position: "absolute",
					top: "14px",
					right: "14px",
					background: "rgba(255,255,255,0.1)",
					border: "none",
					color: "rgba(255,255,255,0.7)",
					fontSize: "16px",
					cursor: "pointer",
					padding: "4px 8px",
					borderRadius: "6px",
					zIndex: 2,
					transition: "background 0.2s",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.background = "rgba(255,255,255,0.2)";
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.background = "rgba(255,255,255,0.1)";
				}}
			>
				✕
			</button>

			{/* Artwork image */}
			{hotspot.info.imageUrl && (
				<div
					style={{
						width: "100%",
						maxHeight: "40vh",
						overflow: "hidden",
						flexShrink: 0,
						background: "rgba(0,0,0,0.5)",
					}}
				>
					<img
						src={hotspot.info.imageUrl}
						alt={hotspot.info.title}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
						}}
					/>
				</div>
			)}

			{/* Content */}
			<div
				style={{
					padding: "20px 24px",
					overflowY: "auto",
					flex: 1,
				}}
			>
				{/* Title */}
				<h3
					style={{
						margin: "0 0 6px 0",
						fontSize: "18px",
						fontWeight: 600,
						lineHeight: 1.3,
					}}
				>
					{hotspot.info.title}
				</h3>

				{/* Artist */}
				{hotspot.info.artist && (
					<p
						style={{
							margin: "0 0 16px 0",
							fontSize: "14px",
							opacity: 0.7,
							fontStyle: "italic",
						}}
					>
						{hotspot.info.artist}
					</p>
				)}

				{/* Divider */}
				<div
					style={{
						height: "1px",
						background: "rgba(255,255,255,0.1)",
						margin: "0 0 16px 0",
					}}
				/>

				{/* Description */}
				{hotspot.info.description && (
					<p
						style={{
							margin: "0 0 16px 0",
							fontSize: "13px",
							lineHeight: 1.6,
							opacity: 0.6,
						}}
					>
						{hotspot.info.description}
					</p>
				)}

				{/* Links */}
				{hotspot.info.links && hotspot.info.links.length > 0 && (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "8px",
						}}
					>
						{hotspot.info.links.map((link) => (
							<a
								key={link.url}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								style={{
									color: "#00d4ff",
									fontSize: "13px",
									textDecoration: "none",
									display: "flex",
									alignItems: "center",
									gap: "4px",
									transition: "opacity 0.2s",
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.opacity = "0.8";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.opacity = "1";
								}}
							>
								{link.label} ↗
							</a>
						))}
					</div>
				)}
			</div>
		</>
	);
}
