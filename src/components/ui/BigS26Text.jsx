import React, { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * BigS26Text triggers a large background text element midway through parsing the scroll track
 */
const BigS26Text = () => {
	const textRef = useRef()

	useGSAP(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: ".scroll-container",
				start: "top top",
				end: "bottom bottom",
				scrub: 1, // Unified scrub timing
			},
		})

		// Appears mid-circus, fades out into detail sections
		tl.fromTo(
			textRef.current,
			{ opacity: 0, scale: 0.25, filter: "blur(24px)", rotation: -8 },
			{ opacity: 0.55, scale: 1, filter: "blur(0px)", rotation: 0, duration: 8 },
			14,
		)
		tl.to(
			textRef.current,
			{ opacity: 0, scale: 2.2, filter: "blur(24px)", rotation: 12, duration: 8 },
			26,
		)

		tl.to({}, { duration: 65 }, 34)
	})

	return (
		<div className="big-s26-container">
			<h1 ref={textRef} className="big-s26-text">
				S26
			</h1>
		</div>
	)
}

export default BigS26Text
