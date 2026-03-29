export const COLORS = [
	{ name: "Black", hex: "#1d1d1d", slug: "black" },
	{ name: "Cobalt Violet", hex: "#5a5868", slug: "cobalt-violet" },
	{ name: "Pink Gold", hex: "#dec5b8", slug: "pink-gold" },
	{ name: "Silver Shadow", hex: "#a4a8ad", slug: "silver-shadow" },
	{ name: "Sky Blue", hex: "#a7c1d3", slug: "sky-blue" },
	{ name: "White", hex: "#f0f0f0", slug: "white" },
]

export const MODELS = COLORS.map(c => `/models/galaxy-s26-plus-${c.slug}-cp.glb`)
