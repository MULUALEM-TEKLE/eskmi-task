import React, { useRef, useState } from "react"
import { useProgress } from "@react-three/drei"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

/**
 * LoadingScreen handles the initial website loading state
 * Displays a nice progress bar relying on Drei's useProgress
 */
const LoadingScreen = () => {
	const { active, progress } = useProgress()
	const [isVisible, setIsVisible] = useState(true)
	const containerRef = useRef()

	// Animate screen away when model loading completes
	useGSAP(() => {
		if (!active && isVisible) {
			const tl = gsap.timeline({ onComplete: () => setIsVisible(false) })
			tl.to(containerRef.current, {
				opacity: 0,
				duration: 1.2,
				delay: 0.4,
				ease: "power2.inOut",
			})
		}
	}, [active, isVisible])

	if (!isVisible) return null

	return (
		<div className="loading-screen" ref={containerRef}>
			<div className="loading-content">
				<p className="loading-eyebrow">Samsung</p>
				<h1>Galaxy S26</h1>
				<div className="progress-bar-container">
					<div className="progress-bar" style={{ width: `${progress}%` }} />
				</div>
				{/* <p className="loading-hint" style={{ opacity: progress < 100 ? 0 : 0.4 }}>
					Scroll to explore
				</p> */}
			</div>
		</div>
	)
}

export default LoadingScreen
