import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type CameraControlsImpl from "camera-controls";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import GalleryScene from "./components/GalleryScene";
import type { HotspotData } from "./components/Hotspot";
import Hotspot from "./components/Hotspot";
import InfoPanel from "./components/InfoPanel";
import LoadingScreen from "./components/LoadingScreen";
import PaintingNavigator from "./components/PaintingNavigator";

// === HOTSPOT DATA ===
// Add more entries here using coordinates from the click helper
const HOTSPOTS: HotspotData[] = [
	{
		id: "painting-1",
		position: [1.448, 0.622, 3.346],
		cameraPosition: [0.653, 0.705, 3.359],
		cameraTarget: [1.448, 0.622, 3.346],
		label: "1",
		info: {
			title: "Portrait of a Two-Year Old Girl",
			artist: "Jan Cornelisz van Loenen",
			description:
				"The girl is probably of the Reiniers family in Utrecht where Van Loenen worked as a portrait artist for a number of years. Originally from Grenoble in France, van Loenen studied in Italy and then settled in Utrecht. He mostly painted religious subjects and portraits. Surviving works of his are relatively uncommon. This painting ranks as one his more significant works.It is signed: Anno 1636 Aetat (is) 2.",
			imageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Jan_Cornelisz_van_Loenen_-_Portrait_of_a_Two-Year_Old_Girl_-_Google_Art_Project.jpg/960px-Jan_Cornelisz_van_Loenen_-_Portrait_of_a_Two-Year_Old_Girl_-_Google_Art_Project.jpg?_=20121001041326",
			links: [
				{
					label: "Google Art",
					url: "https://artsandculture.google.com/asset/portrait-of-a-two-year-old-girl/nwHLBkgYh5Ay_A",
				},
			],
		},
	},
	{
		id: "painting-2",
		position: [-1.355, 0.868, 3.292],
		cameraPosition: [-0.623, 0.548, 3.334],
		cameraTarget: [-1.355, 0.868, 3.292],
		label: "2",
		info: {
			title: "Venus and Cupid",
			artist: "Frans Floris",
			description:
				"The painting shows Venus having caught Cupid´s arrow from his bow. Although the scene bears a resemblence to Flori´s Venus and Cupid in the Uffizi Gallery in Florence, there is a distinct difference in the level of passion. The Hallwyl painting is a study of a slightly disinterested reclining nude accompanied by an almost truculent Cupid; the Uffizi Venus longingly, but yet with a surprised look upon her face, embraces and kisses the small, red cheeked Cupid. The paining is signed F.F.",
			imageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/M%C3%A5lning._Venus._Frans_Floris_-_Hallwylska_museet_-_86707.tif/lossy-page1-1920px-M%C3%A5lning._Venus._Frans_Floris_-_Hallwylska_museet_-_86707.tif.jpg?_=20131009110046",
			links: [
				{
					label: "Google Art",
					url: "https://artsandculture.google.com/asset/venus-and-cupid/rQHXhB1vC2KxLw",
				},
			],
		},
	},
	{
		id: "painting-3",
		position: [1.439, 0.997, 2.978],
		cameraPosition: [0.696, 1.293, 2.993],
		cameraTarget: [1.439, 0.997, 2.978],
		label: "3",
		info: {
			title: "A Merry Company",
			artist: "Anthonie Palamedes",
			description:
				"This is an outstanding example of Palamedesz's merry company scenes paited during his years in Delft. This example must date from about 1633, the date on a very similar scene in the Rijksmuseum, Amsterdam.Palamedesz'paintings are easily recognized; they mostly depict merry companies eating, drinking and playing music. The subject was very popular in Holland at the time, perhaps because of its ambiguity. The men are obviously enjoying themselves, but there are some details which alter the reading of the painting. The gentleman in a red coat - most certainly a soldier - is courting the woman inducing her to dring, and his rapier placed between his legs has its hilt pointing erect towards her. In the background a person is warning him, or her, by raising a forefinger and – more significantly – there is a bed hidden by a dark canopy. On top of the cabinet to the right there stands a statue of a warrior charging into battle with his sword.",
			imageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Anthonie_Palamedesz_-_A_Merry_Company_-_Google_Art_Project.jpg/1920px-Anthonie_Palamedesz_-_A_Merry_Company_-_Google_Art_Project.jpg?_=20121001045945",
			links: [
				{
					label: "Google Art",
					url: "https://artsandculture.google.com/asset/a-merry-company/qwGB4QrB3flWEw",
				},
			],
		},
	},
	{
		id: "painting-4",
		position: [1.452, 0.618, 2.178],
		cameraPosition: [0.678, 0.802, 2.097],
		cameraTarget: [1.452, 0.618, 2.178],
		label: "4",
		info: {
			title: "A Merry Company",
			artist: "Anthonie Palamedes",
			description:
				"This painting belongs to a small group of independent works by Brueghel the Younger. The dependence on his father is revealed stylistically, whereas the composition is entirely his own. The painting uses elements from a number of peasant life by Pieter Brueghel the Elder. It is signed: P.BREVGHEL.",
			imageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/M%C3%A5lning._Pieter_Brueghel%2C_Bondbr%C3%B6llop_-_Hallwylska_museet_-_86695.tif/lossy-page1-1920px-M%C3%A5lning._Pieter_Brueghel%2C_Bondbr%C3%B6llop_-_Hallwylska_museet_-_86695.tif.jpg?_=20131008170659",
			links: [
				{
					label: "Google Art",
					url: "https://artsandculture.google.com/asset/the-peasant-wedding/tQGnUrSWVGpvnw",
				},
			],
		},
	},
	{
		id: "painting-5",
		position: [-0.478, 0.665, -3.844],
		cameraPosition: [-0.58, 1.055, -3.153],
		cameraTarget: [-0.478, 0.665, -3.844],
		label: "5",
		info: {
			title: "Winter Scene on the Ice",
			artist: "Jan van Goyen",
			description:
				"The winter scene is a Dutch speciality adopted by Avercamp and van der Venne at the beginning of the century and continued by Esias van der Velde, van Goyen and Salomon Ruysdael in Haarlem during the 1630´s. Van Goyen then abandons the theme, returning to it in the 1640´s. The painting is signed VGOYEN 1641. The Hallwyl Collection contains five paintings by van Goyen: two seascape or coastal scenes, two landscapes and one winter scene.",
			imageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jan_van_Goyen_-_Winter_Scene_on_the_Ice_-_Google_Art_Project.jpg/1920px-Jan_van_Goyen_-_Winter_Scene_on_the_Ice_-_Google_Art_Project.jpg?_=20121001040213",
			links: [
				{
					label: "Google Art",
					url: "https://artsandculture.google.com/asset/winter-scene-on-the-ice/4QFAgNp9a1OkxQ",
				},
			],
		},
	},
	{
		id: "painting-6",
		position: [1.442, 0.924, 1.78],
		cameraPosition: [0.658, 1.085, 1.786],
		cameraTarget: [1.442, 0.924, 1.78],
		label: "6",
		info: {
			title: "Market Scene",
			artist: "Pieter Aertsen",
			description:
				"The Painting has no religious undertones, as many of Aertsen´s work had, but divulges a highly erotic subject where the saucy looking woman holding a cabbage head – a symbol of female sexuality – bending forward in order do display her breasts to the viewer. The man holdning a carrot, and thus hinting rather unsubtly at his sexual capacity, also points towards the group of vegetables directly opposite the cabbage head: two spherical tomatoes and a veined, upright cucumber.",
			imageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Frukt_och_gr%C3%B6sakshandel._Pieter_Aertsen_-_Hallwylska_museet_-_86399.tif/lossy-page1-1920px-Frukt_och_gr%C3%B6sakshandel._Pieter_Aertsen_-_Hallwylska_museet_-_86399.tif.jpg?_=20131009030801",
			links: [
				{
					label: "Google Art",
					url: "https://artsandculture.google.com/asset/market-scene/vwE63xkF3J9A2g",
				},
			],
		},
	},
	{
		id: "painting-7",
		position: [1.454, 0.542, 1.831],
		cameraPosition: [0.657, 0.61, 1.863],
		cameraTarget: [1.454, 0.542, 1.831],
		label: "7",
		info: {
			title: "Portrait of an Eighty-Year Old Man",
			artist: "Michiel Jansz. van Mierevelt",
			description:
				"Mierevelt was one of the more sought-after portraitists in The Hague, although he was born and died in Delft, and he kept a large workshop in order to satisfy all his customers. Many of his portraits also betray the hand of a pupil. This, however, is one of the most powerful and moving of all Mierevelts portraits of old men and must be entirely his own work. One of his more well-known students is Anthonie Palamedesz also represented in the Hallwyl Collection. The painting is signed to the left: M Mierevelt Aetatis 80 Ao1624.",
			imageUrl:
				"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/M%C3%A5lning._Portr%C3%A4tt_av_%C3%A5ttio%C3%A5rig_man._Michiel_Mierevelt_-_Hallwylska_museet_-_86733.tif/lossy-page1-960px-M%C3%A5lning._Portr%C3%A4tt_av_%C3%A5ttio%C3%A5rig_man._Michiel_Mierevelt_-_Hallwylska_museet_-_86733.tif.jpg?_=20131009110033",
			links: [
				{
					label: "Google Art",
					url: "https://artsandculture.google.com/asset/portrait-of-an-eighty-year-old-man/pwFFTj78oKPamw",
				},
			],
		},
	},
];

// Default camera view
const DEFAULT_CAM_POS: [number, number, number] = [0, 1.3, 1.5];
const DEFAULT_CAM_TARGET: [number, number, number] = [0, 1.1, -2.0];

function SceneControls({
	controlsRef,
}: {
	controlsRef: React.RefObject<CameraControlsImpl>;
}) {
	useEffect(() => {
		const controls = controlsRef.current;
		if (!controls) return;

		controls.setLookAt(...DEFAULT_CAM_POS, ...DEFAULT_CAM_TARGET, false);
	}, [controlsRef]);

	return (
		<CameraControls
			ref={controlsRef}
			makeDefault
			minDistance={0.5}
			maxDistance={4}
			minPolarAngle={Math.PI / 4}
			maxPolarAngle={Math.PI / 1.8}
		/>
	);
}

function HotspotMarkers({
	activeIndex,
	onClickHotspot,
}: {
	activeIndex: number | null;
	onClickHotspot: (data: HotspotData) => void;
}) {
	return (
		<>
			{HOTSPOTS.map((spot, i) => (
				<Hotspot
					key={spot.id}
					data={spot}
					isActive={activeIndex === i}
					onClick={onClickHotspot}
				/>
			))}
		</>
	);
}

export default function App() {
	const controlsRef = useRef<CameraControlsImpl>(null!);

	// Navigator index: always valid (starts at 0), controls which title shows in bottom bar
	const [navIndex, setNavIndex] = useState(0);
	// Active index: which painting is camera-focused (null = no focus)
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const activeHotspot =
		activeIndex !== null ? (HOTSPOTS[activeIndex] ?? null) : null;
	const navHotspot = HOTSPOTS[navIndex] ?? null;

	// --- Navigation helpers ---

	const focusHotspot = useCallback(async (index: number) => {
		const controls = controlsRef.current;
		const hotspot = HOTSPOTS[index];
		if (!controls || !hotspot) return;

		setNavIndex(index);
		setActiveIndex(index);

		await controls.setLookAt(
			...hotspot.cameraPosition,
			...hotspot.cameraTarget,
			true,
		);
	}, []);

	const handleHotspotClick = useCallback(
		(data: HotspotData) => {
			const clickedIndex = HOTSPOTS.findIndex((h) => h.id === data.id);
			if (clickedIndex === -1) return;

			// If clicking the same hotspot, deselect — camera stays
			if (activeIndex === clickedIndex) {
				setActiveIndex(null);
				return;
			}

			focusHotspot(clickedIndex);
		},
		[activeIndex, focusHotspot],
	);

	const goToPrev = useCallback(async () => {
		if (navIndex <= 0) return;
		await focusHotspot(navIndex - 1);
	}, [navIndex, focusHotspot]);

	const goToNext = useCallback(async () => {
		if (navIndex >= HOTSPOTS.length - 1) return;
		await focusHotspot(navIndex + 1);
	}, [navIndex, focusHotspot]);

	// Whether sidebar is visible (separate from active painting)
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Open sidebar whenever a painting is focused
	useEffect(() => {
		if (activeIndex !== null) {
			setSidebarOpen(true);
		}
	}, [activeIndex]);

	const handleCloseSidebar = useCallback(() => {
		setSidebarOpen(false);
		// Camera stays, navigator stays, activeIndex stays
	}, []);

	return (
		<div style={{ width: "100vw", height: "100vh", position: "relative" }}>
			<LoadingScreen />
			<Canvas camera={{ fov: 50, near: 0.05, far: 100 }}>
				{/* Fill light */}
				<ambientLight intensity={1.2} />

				{/* Key light */}
				<directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />

				{/* Room lights */}
				<pointLight position={[0, 2, 0]} intensity={3} distance={8} decay={2} />
				<pointLight
					position={[0, 2, -3]}
					intensity={2}
					distance={6}
					decay={2}
				/>

				<Suspense fallback={null}>
					<GalleryScene />
				</Suspense>

				<HotspotMarkers
					activeIndex={activeIndex}
					onClickHotspot={handleHotspotClick}
				/>
				<SceneControls controlsRef={controlsRef} />
			</Canvas>

			{/* HTML overlays — outside Canvas */}
			<InfoPanel
				hotspot={sidebarOpen ? activeHotspot : null}
				onClose={handleCloseSidebar}
			/>
			<PaintingNavigator
				hotspot={navHotspot}
				hasPrev={navIndex > 0}
				hasNext={navIndex < HOTSPOTS.length - 1}
				onPrev={goToPrev}
				onNext={goToNext}
			/>

			{/* Hide hotspot markers on mobile — navigator handles browsing */}
			<style>{`
				@media (max-width: 640px) {
					.hotspot-marker { display: none !important; }
				}
			`}</style>
		</div>
	);
}
