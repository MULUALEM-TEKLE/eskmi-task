import React, { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * ScrollHint offers an animated UI prompt indicating that 
 * users can scroll downward.
 */
const ScrollHint = () => {
	const hintRef = useRef()

	useGSAP(() => {
		// Fade hint out as soon as user starts scrolling
		gsap.to(hintRef.current, {
			opacity: 0,
			y: 10,
			duration: 0.5,
			ease: "power2.in",
			scrollTrigger: {
				trigger: ".scroll-container",
				start: "top-=50 top",
				end: "top+=100 top",
				scrub: true,
			},
		})
	})

	return (
		<div ref={hintRef} className="scroll-hint">
			<div className="scroll-hint-icon">
				<div className="scroll-hint-dot" />
			</div>
			<span>Scroll to explore</span>
		</div>
	)
}

export default ScrollHint
