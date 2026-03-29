import React, { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { Sparkles } from "@react-three/drei"

const fragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

// Simple 2D noise
float hash(vec2 p) {
	return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x))));
}

float noise(vec2 x) {
	vec2 i = floor(x);
	vec2 f = fract(x);
	float a = hash(i);
	float b = hash(i + vec2(1.0, 0.0));
	float c = hash(i + vec2(0.0, 1.0));
	float d = hash(i + vec2(1.0, 1.0));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
	// UV centered to -1.0 to 1.0
	vec2 st = vUv * 2.0 - 1.0;
	
	// Movement based on time and scroll
	float movement = uTime * 0.1 + uScroll * 1.5;
	
	// Smooth cursor response distance
	float mouseDist = length(st - uMouse);
	
	// Create fluid noise offset
	vec2 offset = vec2(noise(st + movement), noise(st - movement));
	
	// Combine noise with mouse proximity
	float n = noise(st * 1.5 + offset * 0.8 + (mouseDist * 0.2));
	
	// Enhance gradient blending
	float blend = smoothstep(0.1, 1.4, n + (1.0 - mouseDist) * 0.2);
	
	// Mix colors (Deep dark background merging with purple/violet tone)
	vec3 color = mix(uColor1, uColor2, blend);
	
	// Add subtle vignette
	float vignette = length(st);
	color -= vignette * 0.2;
	
	gl_FragColor = vec4(color, 1.0);
}
`

const vertexShader = `
varying vec2 vUv;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const BackgroundSystem = () => {
	const materialRef = useRef()
	const sparklesRef = useRef()

	// Memoize uniforms to prevent recreation
	const uniforms = useMemo(
		() => ({
			uTime: { value: 0 },
			uMouse: { value: new THREE.Vector2(0, 0) },
			uScroll: { value: 0 },
			uColor1: { value: new THREE.Color("#010006") }, // Absolute deep black/purple
			uColor2: { value: new THREE.Color("#130f2d") }, // Elegant subtle violet
		}),
		[],
	)

	useFrame((state) => {
		if (materialRef.current) {
			materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
			
			// Smoothly track mouse coordinates
			materialRef.current.uniforms.uMouse.value.lerp(
				new THREE.Vector2(state.pointer.x, state.pointer.y),
				0.05
			)

			// Fast normalize scroll based on document height
			const scrollY = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) || 0
			
			// Fluidly lerp scroll values into the shader for organic phase shifts
			const currentScroll = materialRef.current.uniforms.uScroll.value
			materialRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(currentScroll, scrollY, 0.08)
		}
		
		// Subtle parallax for the sparkles based on the pointer
		if (sparklesRef.current) {
			sparklesRef.current.position.x = THREE.MathUtils.lerp(
				sparklesRef.current.position.x,
				state.pointer.x * 2.5,
				0.03
			)
			sparklesRef.current.position.y = THREE.MathUtils.lerp(
				sparklesRef.current.position.y,
				state.pointer.y * 2.5,
				0.03
			)
		}
	})

	return (
		<group>
			{/* Fullscreen shader background mapped perfectly back */}
			<mesh position={[0, 0, -20]} scale={[60, 40, 1]}>
				<planeGeometry args={[1, 1]} />
				<shaderMaterial
					ref={materialRef}
					vertexShader={vertexShader}
					fragmentShader={fragmentShader}
					uniforms={uniforms}
					depthWrite={false}
				/>
			</mesh>
			
			{/* Particle systems that sit between the background and models */}
			<group ref={sparklesRef}>
				{/* Violet ambient dust */}
				<Sparkles 
					count={120} 
					scale={35} 
					size={2} 
					speed={0.2} 
					opacity={0.3} 
					noise={1}
					color="#8e82fe" 
					position={[0, 0, -10]}
				/>
				{/* Silver/Blue rare motes */}
				<Sparkles 
					count={40} 
					scale={25} 
					size={4} 
					speed={0.1} 
					opacity={0.15} 
					noise={0.5}
					color="#a7c1d3" 
					position={[0, 0, -5]}
				/>
			</group>
		</group>
	)
}

export default BackgroundSystem
