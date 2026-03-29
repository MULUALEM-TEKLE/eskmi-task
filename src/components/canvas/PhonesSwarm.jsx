import React, { useRef, useEffect } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export const models = [
	"/models/galaxy-s26-plus-black-cp.glb",
	"/models/galaxy-s26-plus-cobalt-violet-cp.glb",
	"/models/galaxy-s26-plus-pink-gold-cp.glb",
	"/models/galaxy-s26-plus-silver-shadow-cp.glb",
	"/models/galaxy-s26-plus-sky-blue-cp.glb",
	"/models/galaxy-s26-plus-white-cp.glb",
]

/**
 * PhonesSwarm manages the 3D phone models.
 * - Scroll mode: circus animation with all 6 phones
 * - Hands-on mode: single phone centered with orbit controls + color switching
 */
const PhonesSwarm = ({ config, activeColorIndex, mode }) => {
	const gltfs = useGLTF(models)
	const groupRef = useRef()
	const phoneRefs = useRef([])
	if (phoneRefs.current.length === 0) {
		phoneRefs.current = models.map(() => React.createRef())
	}

	// ─── Material processing (once on mount) ───
	useEffect(() => {
		gltfs.forEach((gltf, i) => {
			gltf.scene.traverse((child) => {
				if (!child.isMesh) return

				// Make M2_BackCam_Glass fully transparent
				if (
					child.name === "M2_BackCam_Glass" ||
					child.name.includes("BackCam_Glass")
				) {
					if (
						!(child.material instanceof THREE.MeshPhysicalMaterial)
					) {
						const oldMat = child.material
						child.material = new THREE.MeshPhysicalMaterial()
						THREE.MeshStandardMaterial.prototype.copy.call(
							child.material,
							oldMat,
						)
					}
					child.material.transparent = true
					child.material.opacity = 0.02
					child.material.transmission = 1.0
					child.material.thickness = 0.05
					child.material.roughness = 0.03
					child.material.ior = 1.
					child.material.metalness = 0
					child.material.color.set("#ffffff")
					child.material.depthWrite = false
					child.renderOrder = 100
					return // skip further processing for this mesh
				}

				// Only camera-related glass gets transparency
				// (back cover glass, screen glass etc. stay opaque)

				// Lens materials — render before glass
				if (
					child.name.toLowerCase().includes("lense") ||
					child.name.toLowerCase().includes("lens")
				) {
					child.material.metalness = 0.8
					child.material.roughness = 0.2
					child.renderOrder = i
				}

				// Hide AO helpers
				if (child.name.toLowerCase().includes("_ao")) {
					child.visible = false
				}

				// Enable transparency for animation
				child.material.transparent = true
			})
		})
	}, [gltfs])

	// ─── Helper: collect all materials for a phone ref ───
	const getPhoneMaterials = () =>
		phoneRefs.current.map((ref) => {
			const materials = []
			if (ref.current) {
				ref.current.traverse((child) => {
					if (child.isMesh && child.material) {
						materials.push(child.material)
					}
				})
			}
			return materials
		})

	// ─── SCROLL MODE ANIMATION ───
	useGSAP(
		() => {
			if (mode === "handson") return

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: ".scroll-container",
					start: "top top",
					end: "bottom bottom",
					scrub: 1,
				},
			})

			groupRef.current.position.set(0, 0, 0)
			groupRef.current.rotation.set(0, 0, 0)

			const phoneMaterials = getPhoneMaterials()

			phoneRefs.current.forEach((ref, i) => {
				if (!ref.current) return
				const li =
					i === activeColorIndex
						? 0
						: i === 0
							? activeColorIndex
							: i

				phoneMaterials[i].forEach(
					(mat) => (mat.opacity = li === 0 ? 1 : 0),
				)
				ref.current.position.set(0, -2, 0)
				ref.current.rotation.set(-Math.PI / 2, 0, 0)

				if (li === 0) {
					ref.current.scale.set(
						config.introScale,
						config.introScale,
						config.introScale,
					)
				} else {
					ref.current.scale.set(0, 0, 0)
				}

				ref.current.traverse((child) => {
					if (child.isMesh) {
						child.renderOrder = models.length - li
						child.material.depthTest = true
						child.material.depthWrite = true
					}
				})
			})

			// --- 0. Initial Spin ---
			tl.to(
				phoneRefs.current[activeColorIndex].current.rotation,
				{ z: Math.PI, duration: 0.5, ease: "power2.out" },
				0,
			)

			// --- 1. Single to Stacked (0.5-1.5) ---
			phoneRefs.current.forEach((ref, i) => {
				const li =
					i === activeColorIndex
						? 0
						: i === 0
							? activeColorIndex
							: i
				if (li > 0 && phoneMaterials[i].length > 0) {
					tl.to(phoneMaterials[i], { opacity: 1, duration: 0.1 }, 0.5)
					tl.set(
						ref.current.scale,
						{
							x: config.introScale * (1 - li * 0.05),
							y: config.introScale * (1 - li * 0.05),
							z: config.introScale * (1 - li * 0.05),
						},
						0.5,
					)
					tl.set(ref.current.position, { x: 0, y: -2, z: 0 }, 0.5)
					tl.set(
						ref.current.rotation,
						{ x: -Math.PI / 2, y: 0, z: Math.PI },
						0.5,
					)
				} else if (li === 0) {
					tl.to(
						ref.current.scale,
						{
							x: config.introScale,
							y: config.introScale,
							z: config.introScale,
							duration: 1,
							ease: "power2.inOut",
						},
						0.5,
					)
				}

				tl.to(
					ref.current.position,
					{
						x: 0,
						y: -2 + li * config.stackSpreadY * 2,
						z: li * config.stackSpreadZ,
						duration: 1,
						ease: "power2.inOut",
					},
					0.5,
				)
				tl.to(
					ref.current.rotation,
					{
						x: config.stackRotX - Math.PI / 2,
						y: config.stackRotY,
						z: config.stackRotZ,
						duration: 1,
						ease: "power2.inOut",
					},
					0.5,
				)
			})

			// --- 2. Stacked to Flower (1.5-2.5) ---
			const radius = config.flowerRadius
			phoneRefs.current.forEach((ref, i) => {
				const li =
					i === activeColorIndex
						? 0
						: i === 0
							? activeColorIndex
							: i
				const angle = (li / models.length) * Math.PI * 2
				tl.to(
					ref.current.position,
					{
						x: Math.cos(angle) * radius,
						y: Math.sin(angle) * radius,
						z: li * 0.1,
						duration: 1,
						ease: "power2.inOut",
					},
					1.5,
				)
				tl.to(
					ref.current.rotation,
					{
						x: 0,
						y: Math.PI / 2,
						z: angle - Math.PI / 2,
						duration: 1,
						ease: "power2.inOut",
					},
					1.5,
				)
			})

			// --- 3. Rotate and Pull Together (2.5-3.5) ---
			tl.to(
				groupRef.current.rotation,
				{ z: Math.PI * 2, duration: 1, ease: "power2.inOut" },
				2.5,
			)
			phoneRefs.current.forEach((ref) => {
				tl.to(
					ref.current.position,
					{ x: 0, y: 0, z: 0, duration: 1, ease: "power2.inOut" },
					2.5,
				)
				tl.to(
					ref.current.rotation,
					{ x: 0, y: 0, z: 0, duration: 1, ease: "power2.inOut" },
					2.5,
				)
			})

			// --- 4. Move to Intro Pos (3.5-4.5) ---
			phoneRefs.current.forEach((ref, i) => {
				const li =
					i === activeColorIndex
						? 0
						: i === 0
							? activeColorIndex
							: i
				if (li > 0 && ref.current) {
					if (phoneMaterials[i].length > 0) {
						tl.to(
							phoneMaterials[i],
							{
								opacity: 0,
								duration: 0.8,
								ease: "power2.inOut",
							},
							3.5,
						)
					}
					tl.to(
						ref.current.scale,
						{
							x: 0,
							y: 0,
							z: 0,
							duration: 1,
							ease: "power2.in",
						},
						3.5,
					)
				}
			})

			const mainPhone = phoneRefs.current[activeColorIndex].current
			if (phoneMaterials[activeColorIndex].length > 0) {
				tl.to(
					phoneMaterials[activeColorIndex],
					{ opacity: 1, duration: 0.1 },
					3.5,
				)
			}
			tl.to(
				mainPhone.position,
				{ ...config.introPos, duration: 1.2, ease: "power3.inOut" },
				3.5,
			)
			tl.to(
				mainPhone.rotation,
				{ ...config.introRot, duration: 1.2, ease: "power3.inOut" },
				3.5,
			)

			// --- 5. Intro -> Cameras (4.5-6.5) ---
			tl.to(
				mainPhone.rotation,
				{ ...config.camRot, duration: 2, ease: "power2.inOut" },
				4.5,
			)
			tl.to(
				mainPhone.position,
				{ ...config.camPos, duration: 2, ease: "power2.inOut" },
				4.5,
			)

			// --- 6. Cameras -> AI (6.5-8.5) ---
			tl.to(
				mainPhone.rotation,
				{ ...config.aiRot, duration: 2, ease: "power3.inOut" },
				6.5,
			)
			tl.to(
				mainPhone.position,
				{ ...config.aiPos, duration: 2, ease: "power3.inOut" },
				6.5,
			)

			// --- 7. AI -> Processor (8.5-10.5) ---
			tl.to(
				mainPhone.rotation,
				{ ...config.procRot, duration: 2, ease: "power2.inOut" },
				8.5,
			)
			tl.to(
				mainPhone.position,
				{ ...config.procPos, duration: 2, ease: "power2.inOut" },
				8.5,
			)

			// --- 8. Processor -> Battery (10.5-12.5) ---
			tl.to(
				mainPhone.rotation,
				{ ...config.battRot, duration: 2, ease: "power2.inOut" },
				10.5,
			)
			tl.to(
				mainPhone.position,
				{ ...config.battPos, duration: 2, ease: "power2.inOut" },
				10.5,
			)

			// --- 9. Battery -> Final (12.5-14.5) ---
			tl.to(
				mainPhone.rotation,
				{ ...config.finalRot, duration: 2, ease: "power3.inOut" },
				12.5,
			)
			tl.to(
				mainPhone.position,
				{ ...config.finalPos, duration: 2, ease: "power3.inOut" },
				12.5,
			)
			tl.to(
				mainPhone.scale,
				{
					x: config.finalScale,
					y: config.finalScale,
					z: config.finalScale,
					duration: 2,
					ease: "power3.inOut",
				},
				12.5,
			)
		},
		{
			dependencies: [config, activeColorIndex, mode],
			revertOnUpdate: true,
		},
	)

	// ─── HANDS-ON MODE ───
	useEffect(() => {
		if (mode !== "handson") return

		groupRef.current.position.set(0, 0, 0)
		groupRef.current.rotation.set(0, 0, 0)

		// Instant swap — no animation when switching colors
		phoneRefs.current.forEach((ref, i) => {
			if (!ref.current) return

			if (i === activeColorIndex) {
				// Show active phone at center, rotated slightly
				ref.current.traverse((child) => {
					if (child.isMesh) {
						child.material.opacity = 1
					}
				})
				ref.current.position.set(0, 0, 0)
				ref.current.rotation.set(0, -0.3, 0)
				ref.current.scale.set(35, 35, 35)
			} else {
				// Hide non-active phones instantly
				ref.current.traverse((child) => {
					if (child.isMesh) {
						child.material.opacity = 0
					}
				})
				ref.current.scale.set(0, 0, 0)
			}
		})

	}, [mode, activeColorIndex])

	return (
		<group ref={groupRef}>
			{gltfs.map((gltf, index) => (
				<group key={index} ref={phoneRefs.current[index]}>
					<primitive object={gltf.scene.clone()} />
				</group>
			))}
		</group>
	)
}

models.forEach((m) => useGLTF.preload(m))

export default PhonesSwarm
