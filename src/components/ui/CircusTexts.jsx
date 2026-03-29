import React, { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * CircusTexts sequences overarching narrative copy while the 3D phone model does its "circus" 
 * loop animations (scatter, flower, unify, spin).
 */
const CircusTexts = () => {
	const introRef = useRef()
	const craftedRef = useRef()
	const colorsRef = useRef()
	const futureRef = useRef()

	useGSAP(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: ".scroll-container",
				start: "top top",
				end: "bottom bottom",
				scrub: 1,
			},
		})

		const B = "blur(10px)"
		const B0 = "blur(0px)"

		// ── intro ──
		tl.fromTo(
			introRef.current,
			{ autoAlpha: 0, y: 30, filter: B, scale: 0.9 },
			{ autoAlpha: 1, y: 0, filter: B0, scale: 1, duration: 2.5, ease: "power3.out" },
			0,
		)
		tl.to(
			introRef.current,
			{ autoAlpha: 0, y: -30, filter: B, scale: 1.05, duration: 2, ease: "power2.in" },
			"+=0.5",
		)

		// ── crafted ──
		tl.fromTo(
			craftedRef.current,
			{ autoAlpha: 0, y: 30, filter: B, scale: 0.9 },
			{ autoAlpha: 1, y: 0, filter: B0, scale: 1, duration: 2.5, ease: "power3.out" },
			"-=0.5",
		)
		tl.to(
			craftedRef.current,
			{ autoAlpha: 0, y: -30, filter: B, scale: 1.05, duration: 2, ease: "power2.in" },
			"+=0.8",
		)

		// ── colors ──
		tl.fromTo(
			colorsRef.current,
			{ autoAlpha: 0, y: 30, filter: B, scale: 0.9 },
			{ autoAlpha: 1, y: 0, filter: B0, scale: 1, duration: 2.5, ease: "power3.out" },
			"-=0.5",
		)
		tl.to(
			colorsRef.current,
			{ autoAlpha: 0, y: -30, filter: B, scale: 1.05, duration: 2, ease: "power2.in" },
			"+=0.8",
		)

		// ── future ──
		tl.fromTo(
			futureRef.current,
			{ autoAlpha: 0, y: 30, filter: B, scale: 0.9 },
			{ autoAlpha: 1, y: 0, filter: B0, scale: 1, duration: 2.5, ease: "power3.out" },
			"-=0.5",
		)
		tl.to(
			futureRef.current,
			{ autoAlpha: 0, y: -30, filter: B, scale: 1.05, duration: 2, ease: "power2.in" },
			"+=0.8",
		)

		// Expand timeline so all this maps carefully over the 35% mark
		// Let's pad duration to map to `PhonesSwarm` scroll positions
		tl.to({}, { duration: 60 })
	})

	return (
		<div className="circus-texts-overlay">
			<div ref={introRef} className="circus-text centered">
				<div className="circus-text-inner">
					<span className="circus-eyebrow">A New Era</span>
					<h2>The Galaxy S26</h2>
					<p className="sub-text">Smarter. Faster. Bolder.</p>
				</div>
			</div>
			<div ref={craftedRef} className="circus-text centered">
				<div className="circus-text-inner">
					<span className="circus-eyebrow">Precision Engineering</span>
					<h2>Crafted for Perfection</h2>
					<p className="sub-text">Aerospace-grade materials meet fluid design.</p>
				</div>
			</div>
			<div ref={colorsRef} className="circus-text centered">
				<div className="circus-text-inner">
					<span className="circus-eyebrow">Your Style, Amplified</span>
					<h2>Colors that speak</h2>
					<p className="sub-text">Available in six stunning, nature-inspired finishes.</p>
				</div>
			</div>
			<div ref={futureRef} className="circus-text centered combined-text">
				<div className="circus-text-inner">
					<span className="circus-eyebrow">Seamless Intelligence</span>
					<h2>Galaxy AI Is Here</h2>
					<p className="sub-text">Transforming how you create, connect, and explore.</p>
				</div>
			</div>
		</div>
	)
}

export default CircusTexts
