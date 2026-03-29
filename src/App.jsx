import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import { Leva } from "leva"
import Lenis from "lenis"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useProgress } from "@react-three/drei"
import * as THREE from "three"
import Experience from "./Experience"
import CircusTexts from "./components/ui/CircusTexts"
import BigS26Text from "./components/ui/BigS26Text"
import Overlay from "./components/ui/Overlay"
import HandsOnUI from "./components/ui/HandsOnUI"
import HeroText from "./components/ui/HeroText"
import ScrollHint from "./components/ui/ScrollHint"
import LoadingScreen from "./components/ui/LoadingScreen"
import BackgroundSystem from "./components/canvas/BackgroundSystem"

const isHighEndAndDesktop = typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 4) >= 4 && !/Mobi|Android/i.test(navigator.userAgent)

gsap.registerPlugin(ScrollTrigger)

export default function App() {
	const [mode, setMode] = useState("scroll") // 'scroll' | 'handson'
	const [activeColorIndex, setActiveColorIndex] = useState(0)
	const lenisRef = useRef(null)

	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			wheelMultiplier: 1,
		})
		lenisRef.current = lenis

		function raf(time) {
			lenis.raf(time)
			requestAnimationFrame(raf)
		}
		requestAnimationFrame(raf)
		lenis.on("scroll", ScrollTrigger.update)
		gsap.ticker.add((time) => lenis.raf(time * 1000))
		gsap.ticker.lagSmoothing(0)

		return () => {
			lenis.destroy()
			gsap.ticker.remove(lenis.raf)
		}
	}, [])

	// Handle mode transitions
	useEffect(() => {
		if (mode === "handson") {
			document.body.classList.add("handson-active")
			if (lenisRef.current) lenisRef.current.stop()
		} else {
			document.body.classList.remove("handson-active")
			if (lenisRef.current) lenisRef.current.start()
		}
	}, [mode])

	const isHandsOn = mode === "handson"

	return (
		<div className="app">
			<LoadingScreen />

			{/* Text overlays — hidden in hands-on mode */}
			<div
				style={{
					opacity: isHandsOn ? 0 : 1,
					transition: "opacity 0.5s ease",
					pointerEvents: "none",
				}}
			>
				<CircusTexts />
				<BigS26Text />
				<HeroText />
				<ScrollHint />
			</div>

			<Leva hidden />

			{/* Canvas — interactive in hands-on mode */}
			<div
				className={`canvas-wrapper ${isHandsOn ? "interactive" : ""}`}
			>
				<Canvas
					shadows={{ type: THREE.PCFShadowMap }}
					camera={{ position: [0, 0, 12], fov: 35 }}
					gl={{
						antialias: true,
						alpha: true,
						powerPreference: "high-performance",
						toneMapping: THREE.ACESFilmicToneMapping,
						toneMappingExposure: 1.1,
					}}
					dpr={[1, Math.min(window.devicePixelRatio, 2)]}
				>
					{isHighEndAndDesktop && !isHandsOn && <BackgroundSystem />}
					<Suspense fallback={null}>
						<Experience
							mode={mode}
							activeColorIndex={activeColorIndex}
						/>
					</Suspense>
				</Canvas>
			</div>

			{/* Spec overlays — hidden in hands-on mode */}
			<Overlay mode={mode} />

			{/* Hands-on UI: explore button + color picker */}
			<HandsOnUI
				mode={mode}
				setMode={setMode}
				activeColorIndex={activeColorIndex}
				setActiveColorIndex={setActiveColorIndex}
			/>

			{/* Scroll container — locked in hands-on mode */}
			<div
				className={`scroll-container ${isHandsOn ? "locked" : ""}`}
			>
				<div style={{ height: "250vh" }} />
				<section className="section" />
				<section className="section" />
				<section className="section" />
				<section className="section" />
				<section className="section" />
			</div>
		</div>
	)
}
