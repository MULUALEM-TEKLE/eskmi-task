import React, { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import AISection from "./AISection"

gsap.registerPlugin(ScrollTrigger)

/**
 * Overlay manages a stack of specification sections (Displays, Battery, Camera, etc).
 * Binds scroll-trigger logic uniformly to child HTML nodes.
 */
const Overlay = ({ mode }) => {
	const overlayRef = useRef()

	useGSAP(() => {
		const sections = gsap.utils.toArray(".section")
		const overlays = gsap.utils.toArray(".overlay-section:not(.ai-section)")

		overlays.forEach((overlay, i) => {
			// Map overlays to virtual scroll sections
			const sectionIdx = i < 2 ? i : i + 1
			const trigger = sections[sectionIdx]
			if (!trigger) return

			const headlineElements = Array.from(overlay.children).filter(
				(c) => !c.classList.contains("spec-accent-line") && !c.classList.contains("spec-pills")
			)
			const line = overlay.querySelector(".spec-accent-line")
			const pills = overlay.querySelectorAll(".spec-pill")

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger,
					start: "top 65%",
					end: "center 35%",
					toggleActions: "play reverse play reverse",
				},
			})

			// Envelope wrapper fade-in
			tl.fromTo(
				overlay,
				{ autoAlpha: 0, y: 32, filter: "blur(24px)" },
				{ autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.inOut" },
			)

			// Fade in headline parts (excluding pills and line)
			tl.fromTo(
				headlineElements,
				{ autoAlpha: 0, filter: "blur(12px)" },
				{ autoAlpha: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.inOut" },
				"-=0.7"
			)

			// Render accent line width
			if (line) {
				tl.fromTo(
					line,
					{ scaleX: 0, autoAlpha: 0 },
					{ scaleX: 1, autoAlpha: 1, duration: 0.8, ease: "power2.inOut" },
					"-=0.6",
				)
			}

			// Render bottom spec pills progressively
			if (pills.length) {
				tl.fromTo(
					pills,
					{ autoAlpha: 0, y: 24, scale: 0.9, filter: "blur(12px)" },
					{
						autoAlpha: 1,
						y: 0,
						scale: 1,
						filter: "blur(0px)",
						duration: 0.6,
						stagger: 0.08,
						ease: "power2.inOut",
					},
					"-=0.6",
				)
			}
		})
	})

	return (
		<div 
			className="overlay" 
			ref={overlayRef}
			style={{ 
				opacity: mode === 'handson' ? 0 : 1, 
				transition: 'opacity 0.4s ease',
				pointerEvents: 'none'
			}}
		>
			<div className="overlay-content">

				{/* ── Section 0: Design / Intro ── */}
				<div className="overlay-section">
					<p className="eyebrow">Galaxy S26 | S26+</p>
					<h1>Designed to Impress</h1>
					<p className="description">
						Starting at $899.99. Slim, strong, and sleek — built to last.
					</p>
					<div className="spec-accent-line" />
					<div className="spec-pills cols-2">
						{[
							{ icon: "◻", label: "Ultra-slim", desc: "7.2 mm (S26) · 7.3 mm (S26+)" },
							{ icon: "⬡", label: "Featherlight", desc: "167 g (S26) · 190 g (S26+)" },
							{ icon: "◈", label: "Armor Aluminum", desc: "Military-grade reinforced frame" },
							{ icon: "✦", label: "Gorilla Glass Victus 2", desc: "Scratch & drop resistant" },
							{ icon: "◎", label: "IP68 Rated", desc: "Dust & water resistant" },
							{ icon: "⟡", label: "6 Colors", desc: "Silver Shadow · Cobalt Violet · Sky Blue…" },
						].map((f, i) => (
							<div key={i} className="spec-pill">
								<span className="spec-pill-icon">{f.icon}</span>
								<div className="spec-pill-text">
									<strong>{f.label}</strong>
									<span>{f.desc}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* ── Section 1: Cameras ── */}
				<div className="overlay-section right-aligned">
					<p className="eyebrow">Pro-Grade Cameras</p>
					<h1>Every Shot, Perfected</h1>
					<p className="description">
						ProVisual Engine — clear, vivid, and bright even at night.
					</p>
					<div className="spec-accent-line" />
					<div className="spec-pills cols-2">
						{[
							{ icon: "◉", label: "50 MP Wide", desc: "f/1.8 · 2× optical-quality zoom" },
							{ icon: "◎", label: "12 MP Ultra Wide", desc: "f/2.2 · expansive field of view" },
							{ icon: "⬡", label: "10 MP Telephoto", desc: "f/2.4 · 3× optical · 30× digital" },
							{ icon: "✦", label: "12 MP Selfie", desc: "f/2.2 · AI ISP natural skin tones" },
							{ icon: "◈", label: "Nightography", desc: "Vivid low-light video & photos" },
							{ icon: "⟡", label: "Super Steady", desc: "Horizontal Lock · shake-free video" },
						].map((f, i) => (
							<div key={i} className="spec-pill">
								<span className="spec-pill-icon">{f.icon}</span>
								<div className="spec-pill-text">
									<strong>{f.label}</strong>
									<span>{f.desc}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* ── Section 2: AI (handled by its own component) ── */}
				<AISection />

				{/* ── Section 3: Performance / Processor ── */}
				<div className="overlay-section">
					<p className="eyebrow">Snapdragon® 8 Elite Gen 5 for Galaxy</p>
					<h1>Customized for Galaxy</h1>
					<p className="description">
						Blazing speed, smooth visuals — and a 29% cooler Vapor Chamber.
					</p>
					<div className="spec-accent-line" />
					<div className="spec-pills cols-2">
						{[
							{ icon: "✦", label: "NPU +38%", desc: "Faster AI vs. Galaxy S25+" },
							{ icon: "◈", label: "GPU +23%", desc: "Improved graphics performance" },
							{ icon: "⬡", label: "CPU +17%", desc: "Faster processing speed" },
							{ icon: "◎", label: "ProScaler AI", desc: "AI-enhanced display upscaling" },
							{ icon: "⟡", label: "Vapor Chamber", desc: "29% better heat dissipation" },
							{ icon: "◉", label: "Ray Tracing", desc: "Vulkan-optimised gaming graphics" },
						].map((f, i) => (
							<div key={i} className="spec-pill">
								<span className="spec-pill-icon">{f.icon}</span>
								<div className="spec-pill-text">
									<strong>{f.label}</strong>
									<span>{f.desc}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* ── Section 4: Battery ── */}
				<div className="overlay-section left-aligned">
					<p className="eyebrow">Battery</p>
					<h1>Power up quickly</h1>
					<p className="description">
						All-day power with next-level fast charging — no interruptions.
					</p>
					<div className="spec-accent-line" />
					<div className="spec-pills cols-2">
						{[
							{ icon: "⬡", label: "4,300 mAh (S26)", desc: "31 hrs video playback" },
							{ icon: "⬡", label: "4,900 mAh (S26+)", desc: "31 hrs video playback" },
							{ icon: "✦", label: "25W Fast Charge", desc: "Up to 55% in ~30 mins (S26)" },
							{ icon: "✦", label: "45W Super Fast", desc: "Up to 69% in ~30 mins (S26+)" },
							{ icon: "◎", label: "Wireless Charging", desc: "15W wireless · 4.5W reverse" },
							{ icon: "◈", label: "+10 hrs longer", desc: "Than Galaxy S22 series" },
						].map((f, i) => (
							<div key={i} className="spec-pill">
								<span className="spec-pill-icon">{f.icon}</span>
								<div className="spec-pill-text">
									<strong>{f.label}</strong>
									<span>{f.desc}</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* ── Section 5: Display ── */}
				<div className="overlay-section">
					<p className="eyebrow">Display</p>
					<h1>See it. Feel it.</h1>
					<p className="description">
						10-bit Dynamic AMOLED 2X — colour exactly as the creator intended.
					</p>
					<div className="spec-accent-line" />
					<div className="spec-pills cols-2">
						{[
							{ icon: "◉", label: '6.3" (S26)', desc: "Dynamic AMOLED 2X · 2340×1080" },
							{ icon: "◉", label: '6.7" (S26+)', desc: "Dynamic AMOLED 2X · 3120×1440" },
							{ icon: "✦", label: "120Hz Adaptive", desc: "Buttery-smooth scrolling" },
							{ icon: "⬡", label: "2,600 nits peak", desc: "4× color depth via mDNIe" },
							{ icon: "◈", label: "Vision Booster", desc: "Crystal-clear in bright sunlight" },
							{ icon: "⟡", label: "ProScaler", desc: "AI upscaling to QHD+" },
						].map((f, i) => (
							<div key={i} className="spec-pill">
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
		</div>
	)
}

export default Overlay
