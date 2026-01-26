import React from "react";
import { PasswordBuilder } from "./interactives/PasswordBuilder";
import { TermSorter } from "./interactives/TermSorter";
import { ChatSimulation } from "./interactives/ChatSimulation";
import { WifiSimulator } from "./interactives/WifiSimulator";
import { CryptoScanner } from "./interactives/CryptoScanner";
import { TotpSimulator } from "./interactives/TotpSimulator";

const VARIANTS = {
	"password-builder": PasswordBuilder,
	"term-sorter": TermSorter,
	"chat-simulation": ChatSimulation,
	"wifi-simulator": WifiSimulator,
	"crypto-scanner": CryptoScanner,
	"totp-simulator": TotpSimulator,
};

export const InteractiveSlide = ({ slide, onNext }) => {
	const Component = VARIANTS[slide.variant];

	return (
		<div className="h-full flex flex-col items-center justify-center p-6 md:p-8 text-center max-w-4xl mx-auto">
			<h2 className="text-3xl font-bold text-[var(--color-primary)] mb-4">{slide.title}</h2>
			<p className="text-[var(--color-text-secondary)] mb-8 text-lg">{slide.description}</p>

			{Component ? (
				<Component onComplete={onNext} data={slide.data} labels={slide.labels} />
			) : (
				<div className="p-8 border border-dashed border-[var(--color-error)] rounded-xl">
					Unknown interactive variant: {slide.variant}
					<button onClick={onNext} className="block mt-4 text-sm underline">
						Skip
					</button>
				</div>
			)}
		</div>
	);
};
