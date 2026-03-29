import React, { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * HeroText renders the primary headline at top level
 * It smoothly blurs and shrinks out once the user starts scrolling
 */
const HeroText = () => {
	const containerRef = useRef()

	useGSAP(() => {
		gsap.fromTo(
			containerRef.current,
			{ opacity: 1, y: 0, filter: "blur(0px)" },
			{
				opacity: 0,
				y: -40,
				filter: "blur(12px)",
				ease: "power2.in",
				scrollTrigger: {
					trigger: ".scroll-container",
					start: "top top",
					end: "+=8%",
					scrub: 1, // Follow scroll precisely
				},
			},
		)
	})

	return (
		<div className="hero-text" ref={containerRef}>
			<div className="hero-text-inner">
				<p className="hero-eyebrow">Samsung Galaxy S26</p>
				<h2 className="hero-headline">
					The phone that thinks
					<br />
					<em>with you.</em>
				</h2>
			</div>
		</div>
	)
}

export default HeroText
