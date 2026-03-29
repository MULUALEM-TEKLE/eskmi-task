import React, { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * AISection displays Galaxy AI features in an animated pill-grid layout.
 * Shown as the 3rd content slide.
 */
const AISection = () => {
	const sectionRef = useRef()
	const headlineRef = useRef()
	const pillsRef = useRef([])
	const lineRef = useRef()

	const features = [
		{ icon: "✦", label: "Real-Time Translation", desc: "72 languages, no internet" },
		{ icon: "◈", label: "AI Photo Remaster", desc: "Enhance any moment, instantly" },
		{ icon: "⬡", label: "Live Summarize", desc: "Meetings, docs & more" },
		{ icon: "◎", label: "Generative Edit", desc: "Remove, move, fill objects" },
		{ icon: "⟡", label: "Note Assist", desc: "Smart, structured notes" },
		{ icon: "⌘", label: "Circle to Search", desc: "Search anything on screen" },
	]

	useGSAP(() => {
		const aiSection = document.querySelectorAll(".section")[2]
		if (!aiSection) return

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: aiSection,
				start: "top 65%",
				end: "center 35%",
				toggleActions: "play reverse play reverse",
			},
		})

		// Animate outer wrapper
		tl.fromTo(
			sectionRef.current,
			{ opacity: 0, y: 24, filter: "blur(8px)" },
			{ opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" },
		)
		// Accent line grows horizontally
		tl.fromTo(
			lineRef.current,
			{ scaleX: 0, opacity: 0 },
			{ scaleX: 1, opacity: 1, duration: 0.45, ease: "power2.out" },
			"-=0.3",
		)
		// Component pills stagger in beautifully
		tl.fromTo(
			pillsRef.current,
			{ opacity: 0, y: 18, scale: 0.9, filter: "blur(6px)" },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				filter: "blur(0px)",
				duration: 0.4,
				stagger: 0.065,
				ease: "power2.out",
			},
			"-=0.2",
		)
	})

	return (
		<div className="overlay-section ai-section" ref={sectionRef}>
			<div className="ai-section-inner" ref={headlineRef}>
				<p className="eyebrow">Galaxy AI</p>
				<h1>Intelligence, Built In</h1>
				<p className="description">
					The S26 comes loaded with next-gen on-device AI — no subscriptions, no cloud required.
				</p>
				<div ref={lineRef} className="spec-accent-line" />
				<div className="spec-pills cols-3">
					{features.map((f, i) => (
						<div
							key={i}
							className="spec-pill"
							ref={(el) => (pillsRef.current[i] = el)}
						>
							<span className="spec-pill-icon">{f.icon}</span>
							<div className="spec-pill-text">
								<strong>{f.label}</strong>
								<span>{f.desc}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default AISection
