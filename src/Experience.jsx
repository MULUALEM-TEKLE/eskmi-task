import React, { useRef } from "react"
import { Environment, ContactShadows, OrbitControls } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import { useControls, folder } from "leva"
import * as THREE from "three"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
	EffectComposer,
	Bloom,
	Vignette,
	ChromaticAberration,
} from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import PhonesSwarm from "./components/canvas/PhonesSwarm"
import BackgroundSystem from "./components/canvas/BackgroundSystem"

const isHighEnd =
	typeof navigator !== "undefined" && (navigator.hardwareConcurrency || 4) >= 4

const Experience = ({ mode, activeColorIndex }) => {
	const controlsRef = useRef()
	const { camera } = useThree()

	useGSAP(() => {
		if (mode === "scroll") {
			// Animate camera back to the original scroll layout position smoothly
			gsap.to(camera.position, {
				x: 0,
				y: 0,
				z: 12,
				duration: 1.2,
				ease: "power3.inOut"
			})
			gsap.to(camera.rotation, {
				x: 0,
				y: 0,
				z: 0,
				duration: 1.2,
				ease: "power3.inOut"
			})
			if (controlsRef.current) {
				gsap.to(controlsRef.current.target, {
					x: 0,
					y: 0,
					z: 0,
					duration: 1.2,
					ease: "power3.inOut"
				})
			}
		}
	}, [mode])

	const config = useControls({
		Circus: folder({
			stackSpreadX: { value: 1.5, step: 0.1 },
			stackSpreadY: { value: 0.2, step: 0.1 },
			stackSpreadZ: { value: -0.5, step: 0.1 },
			stackRotX: { value: 0.2, step: 0.1 },
			stackRotY: { value: -0.2, step: 0.1 },
			stackRotZ: { value: Math.PI / 2 + 0.1, step: 0.1 },
			flowerRadius: { value: 5, step: 0.1 },
		}),
		Intro: folder({
			introPos: { value: { x: 0, y: -1, z: 4.0 }, step: 0.1 },
			introRot: { value: { x: -1, y: 0, z: 0 }, step: 0.1 },
			introScale: { value: 40, step: 1 },
		}),
		Camera: folder({
			camPos: { value: { x: -0.4, y: -1.6, z: 6.9 }, step: 0.1 },
			camRot: { value: { x: 0, y: 4.54, z: 0 }, step: 0.1 },
		}),
		AI: folder({
			aiPos: { value: { x: 2, y: 0, z: 3 }, step: 0.1 },
			aiRot: {
				value: { x: 0, y: Math.PI * 0.5, z: Math.PI / 2 },
				step: 0.1,
			},
		}),
		Processor: folder({
			procPos: { value: { x: 0, y: 0, z: 2 }, step: 0.1 },
			procRot: {
				value: { x: 0.1, y: Math.PI * 1.5, z: -0.1 },
				step: 0.1,
			},
		}),
		Battery: folder({
			battPos: { value: { x: 2, y: -1, z: 3 }, step: 0.1 },
			battRot: {
				value: { x: -0.2, y: Math.PI * 2, z: 0.2 },
				step: 0.1,
			},
		}),
		Final: folder({
			finalPos: { value: { x: 0, y: 0, z: 0 }, step: 0.1 },
			finalRot: {
				value: { x: 0, y: Math.PI * 2, z: 0 },
				step: 0.1,
			},
			finalScale: { value: 35, step: 1 },
		}),
		PostProcessing: folder({
			bloomIntensity: { value: 0.075, min: 0, max: 2, step: 0.1 },
			bloomThreshold: { value: 0, min: 0, max: 1, step: 0.05 },
			bloomSmoothing: { value: 1, min: 0, max: 1, step: 0.05 },
			vignetteOffset: { value: 0.3, min: 0, max: 1, step: 0.05 },
			vignetteDarkness: { value: 0.45, min: 0, max: 1, step: 0.05 },
			chromaOffset: { value: 0.0004, min: 0, max: 0.01, step: 0.0001 },
		}),
	})

	return (
		<>
			<BackgroundSystem />
			<Environment preset="studio" intensity={1.2} />

			<ambientLight intensity={0.4} />
			<directionalLight
				position={[10, 10, 10]}
				intensity={1.8}
				castShadow
				shadow-mapSize={[2048, 2048]}
				shadow-bias={-0.0001}
			/>
			<directionalLight
				position={[-10, 5, -5]}
				intensity={0.8}
				color="#ffffff"
			/>
			{/* Rim light for edge highlights */}
			<directionalLight
				position={[0, -5, -10]}
				intensity={0.4}
				color="#8e82fe"
			/>
			{/* Top fill */}
			<pointLight position={[0, 10, 0]} intensity={0.3} color="#ffffff" />

			<OrbitControls
				ref={controlsRef}
				enabled={mode === "handson"}
				enablePan={false}
				enableDamping
				dampingFactor={0.08}
				minDistance={5}
				maxDistance={14}
				minPolarAngle={Math.PI * 0.15}
				maxPolarAngle={Math.PI * 0.85}
				rotateSpeed={0.6}
			/>

			<PhonesSwarm
				config={config}
				activeColorIndex={activeColorIndex}
				mode={mode}
			/>

			{/* <ContactShadows
				position={[0, -4, 0]}
				opacity={0.4}
				scale={30}
				blur={2.5}
				far={10}
			/> */}

			{/* Post-processing — high-end devices only */}
			{isHighEnd && (
				<EffectComposer multisampling={4}>
					<Bloom
						intensity={mode === "handson" ? 0 : config.bloomIntensity}
						luminanceThreshold={config.bloomThreshold}
						luminanceSmoothing={config.bloomSmoothing}
						// mipmapBlur
					/>
					<Vignette
						offset={config.vignetteOffset}
						darkness={config.vignetteDarkness}
						blendFunction={BlendFunction.NORMAL}
					/>
					<ChromaticAberration
						offset={new THREE.Vector2(config.chromaOffset, config.chromaOffset)}
						blendFunction={BlendFunction.NORMAL}
						radialModulation={true}
						modulationOffset={0.5}
					/>
				</EffectComposer>
			)}
		</>
	)
}

export default Experience
