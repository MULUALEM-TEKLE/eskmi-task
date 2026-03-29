import React, { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

import { COLORS as colors } from "../../constants"

const HandsOnUI = ({ mode, setMode, activeColorIndex, setActiveColorIndex }) => {
	const buttonRef = useRef()

	// Show explore button only at the very end of scroll
	useGSAP(
		() => {
			if (mode === "handson") return
			if (!buttonRef.current) return

			gsap.set(buttonRef.current, { opacity: 0, y: 20, pointerEvents: "none" })

			gsap.to(buttonRef.current, {
				opacity: 1,
				y: 0,
				pointerEvents: "auto",
				duration: 0.5,
				ease: "power2.out",
				scrollTrigger: {
					trigger: ".scroll-container",
					start: "bottom-=50 bottom",
					end: "bottom bottom",
					toggleActions: "play none none reverse",
				},
			})
		},
		{ dependencies: [mode] },
	)

	if (mode === "scroll") {
		return (
			<button
				ref={buttonRef}
				className="explore-button"
				onClick={() => setMode("handson")}
			>
				✦ Explore Hands-On
			</button>
		)
	}

	return (
		<div className="handson-panel">
			<div className="handson-inner">
				{/* Top row: hint + close */}
				<div className="handson-top-row">
					<span className="interaction-hint">
						Drag to rotate · Scroll to zoom
					</span>
					<button
						className="close-handson-btn"
						onClick={() => setMode("scroll")}
					>
						✕ Exit
					</button>
				</div>

				{/* Color picker */}
				<div className="color-picker-container">
					<div className="color-dots">
						{colors.map((c, i) => (
							<button
								key={c.name}
								className={`color-dot ${i === activeColorIndex ? "active" : ""}`}
								style={{ backgroundColor: c.hex }}
								onClick={() => setActiveColorIndex(i)}
								aria-label={c.name}
							/>
						))}
					</div>
					<p className="active-color-name">
						{colors[activeColorIndex].name}
					</p>
				</div>
			</div>
		</div>
	)
}

export default HandsOnUI
