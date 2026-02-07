import confetti from "canvas-confetti";

export const triggerStandard = () => {
	confetti({
		particleCount: 100,
		spread: 70,
		origin: { y: 0.6 },
		colors: ["#a855f7", "#ec4899", "#3b82f6"], // Primary, Secondary, Info colors
	});
};

export const triggerCelebration = () => {
	const count = 200;
	const defaults = {
		origin: { y: 0.7 },
		colors: ["#a855f7", "#ec4899", "#3b82f6", "#facc15"], // Added yellow for gold
	};

	function fire(particleRatio, opts) {
		confetti({
			...defaults,
			...opts,
			particleCount: Math.floor(count * particleRatio),
		});
	}

	fire(0.25, {
		spread: 26,
		startVelocity: 55,
	});
	fire(0.2, {
		spread: 60,
	});
	fire(0.35, {
		spread: 100,
		decay: 0.91,
		scalar: 0.8,
	});
	fire(0.1, {
		spread: 120,
		startVelocity: 25,
		decay: 0.92,
		scalar: 1.2,
	});
	fire(0.1, {
		spread: 120,
		startVelocity: 45,
	});
};
