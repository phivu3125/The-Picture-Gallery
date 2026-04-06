import type { HotspotData } from "./Hotspot";

interface PaintingNavigatorProps {
	hotspot: HotspotData | null;
	hasPrev: boolean;
	hasNext: boolean;
	onPrev: () => void;
	onNext: () => void;
}

const NAV_BUTTON_STYLE: React.CSSProperties = {
	width: "36px",
	height: "36px",
	borderRadius: "50%",
	border: "none",
	background: "rgba(255,255,255,0.1)",
	color: "rgba(255,255,255,0.85)",
	fontSize: "16px",
	cursor: "pointer",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	transition: "background 0.2s, opacity 0.2s",
};

const NAV_BUTTON_DISABLED_STYLE: React.CSSProperties = {
	...NAV_BUTTON_STYLE,
	opacity: 0.3,
	cursor: "default",
};

export default function PaintingNavigator({
	hotspot,
	hasPrev,
	hasNext,
	onPrev,
	onNext,
}: PaintingNavigatorProps) {
	return (
		<div
			style={{
				position: "absolute",
				bottom: "24px",
				left: "50%",
				transform: hotspot
					? "translateX(-50%) translateY(0)"
					: "translateX(-50%) translateY(80px)",
				opacity: hotspot ? 1 : 0,
				transition:
					"transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
				pointerEvents: hotspot ? "auto" : "none",
				zIndex: 100,
				width: "min(520px, calc(100vw - 32px))",
				height: "44px",
				background: "rgba(0, 0, 0, 0.72)",
				backdropFilter: "blur(12px)",
				borderRadius: "999px",
				display: "flex",
				alignItems: "center",
				padding: "0 4px",
				gap: "4px",
				fontFamily: "system-ui, -apple-system, sans-serif",
				boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
			}}
		>
			{/* Prev button */}
			<button
				type="button"
				onClick={hasPrev ? onPrev : undefined}
				style={hasPrev ? NAV_BUTTON_STYLE : NAV_BUTTON_DISABLED_STYLE}
				onMouseEnter={(e) => {
					if (hasPrev)
						e.currentTarget.style.background = "rgba(255,255,255,0.2)";
				}}
				onMouseLeave={(e) => {
					if (hasPrev)
						e.currentTarget.style.background = "rgba(255,255,255,0.1)";
				}}
			>
				&#9664;
			</button>

			{/* Title */}
			<span
				style={{
					flex: 1,
					textAlign: "center",
					color: "rgba(255,255,255,0.9)",
					fontSize: "15px",
					fontWeight: 500,
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					padding: "0 8px",
					userSelect: "none",
				}}
			>
				{hotspot?.info.title ?? ""}
			</span>

			{/* Next button */}
			<button
				type="button"
				onClick={hasNext ? onNext : undefined}
				style={hasNext ? NAV_BUTTON_STYLE : NAV_BUTTON_DISABLED_STYLE}
				onMouseEnter={(e) => {
					if (hasNext)
						e.currentTarget.style.background = "rgba(255,255,255,0.2)";
				}}
				onMouseLeave={(e) => {
					if (hasNext)
						e.currentTarget.style.background = "rgba(255,255,255,0.1)";
				}}
			>
				&#9654;
			</button>
		</div>
	);
}
