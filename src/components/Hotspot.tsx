import { Html } from "@react-three/drei";
import { useState } from "react";

export interface HotspotData {
	id: string;
	/** Position on the surface (where the marker sits) */
	position: [number, number, number];
	/** Camera position when focused */
	cameraPosition: [number, number, number];
	/** Camera look-at target when focused */
	cameraTarget: [number, number, number];
	/** Label shown on the marker */
	label: string;
	/** Info panel content */
	info: {
		title: string;
		artist?: string;
		description?: string;
		imageUrl?: string;
		links?: Array<{ label: string; url: string }>;
	};
}

interface HotspotProps {
	data: HotspotData;
	isActive: boolean;
	onClick: (data: HotspotData) => void;
}

export default function Hotspot({ data, isActive, onClick }: HotspotProps) {
	const [hovered, setHovered] = useState(false);

	const borderColor = isActive
		? "#00d4ff"
		: hovered
			? "#66e0ff"
			: "rgba(255,255,255,0.6)";
	const bgColor = isActive
		? "rgba(0, 212, 255, 0.25)"
		: hovered
			? "rgba(255,255,255,0.15)"
			: "rgba(0,0,0,0.5)";

	return (
		<group position={data.position}>
			<Html center className="hotspot-marker">
				<div
					onClick={(e) => {
						e.stopPropagation();
						onClick(data);
					}}
					onMouseEnter={() => {
						setHovered(true);
						document.body.style.cursor = "pointer";
					}}
					onMouseLeave={() => {
						setHovered(false);
						document.body.style.cursor = "auto";
					}}
					style={{
						width: "32px",
						height: "32px",
						borderRadius: "50%",
						border: `2px solid ${borderColor}`,
						background: bgColor,
						color: "white",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: "13px",
						fontWeight: 600,
						fontFamily: "system-ui, sans-serif",
						backdropFilter: "blur(4px)",
						transition: "all 0.2s ease",
						userSelect: "none",
						boxShadow: isActive
							? "0 0 12px rgba(0,212,255,0.5)"
							: "0 2px 8px rgba(0,0,0,0.3)",
					}}
				>
					{data.label}
				</div>
			</Html>
		</group>
	);
}
