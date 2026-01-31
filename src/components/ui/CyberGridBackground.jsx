import React, { useEffect, useRef } from "react";

export const CyberGridBackground = () => {
	const containerRef = useRef(null);

	useEffect(() => {
		let rafId;
		const handleMouseMove = (e) => {
			if (rafId) return;
			rafId = requestAnimationFrame(() => {
				if (!containerRef.current) return;
				const x = e.clientX;
				const y = e.clientY;
				containerRef.current.style.setProperty("--mouse-x", `${x}px`);
				containerRef.current.style.setProperty("--mouse-y", `${y}px`);
				rafId = null;
			});
		};

		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, []);

	return (
		<div
			ref={containerRef}
			className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-bg-base"
			style={{
				"--grid-color": "rgba(208, 188, 255, 0.15)",
				"--grid-size": "40px",
			}}>
			{/* Static Grid Layer */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `
                        linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
                    `,
					backgroundSize: "var(--grid-size) var(--grid-size)",
				}}
			/>

			{/* Interactive Highlight Layer - Grid lights up near cursor */}
			<div
				className="absolute inset-0"
				style={{
					backgroundImage: `
                        linear-gradient(to right, rgba(208, 188, 255, 0.6) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(208, 188, 255, 0.6) 1px, transparent 1px)
                    `,
					backgroundSize: "var(--grid-size) var(--grid-size)",
					// Only reveal this brighter grid near the mouse using a mask
					WebkitMaskImage:
						"radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)",
					maskImage:
						"radial-gradient(350px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), black, transparent)",
				}}
			/>

			{/* Vignette for cinematic look */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,9,18,0.4)_100%)] pointer-events-none" />
		</div>
	);
};
