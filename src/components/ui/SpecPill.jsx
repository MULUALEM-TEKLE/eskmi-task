import React, { forwardRef } from "react"

/**
 * SpecPill is a reusable UI element for displaying product features.
 * Supports forwardRef to integrate with GSAP animations in AISection.
 */
const SpecPill = forwardRef(({ icon, label, desc, className = "" }, ref) => {
	return (
		<div className={`spec-pill ${className}`} ref={ref}>
			<span className="spec-pill-icon">{icon}</span>
			<div className="spec-pill-text">
				<strong>{label}</strong>
				<span>{desc}</span>
			</div>
		</div>
	)
})

SpecPill.displayName = "SpecPill"

export default SpecPill
