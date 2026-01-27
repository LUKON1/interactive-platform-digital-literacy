import React from "react";
import { PasswordBuilder } from "./interactives/PasswordBuilder";
import { TermSorter } from "./interactives/TermSorter";
import { ChatSimulation } from "./interactives/ChatSimulation";
import { WifiSimulator } from "./interactives/WifiSimulator";
import { CryptoScanner } from "./interactives/CryptoScanner";
import { TotpSimulator } from "./interactives/TotpSimulator";
import { ImageQuiz } from "./interactives/ImageQuiz";
import { EmailInspector } from "./interactives/EmailInspector";

const VARIANTS = {
	"password-builder": PasswordBuilder,
	"term-sorter": TermSorter,
	"chat-simulation": ChatSimulation,
	"wifi-simulator": WifiSimulator,
	"crypto-scanner": CryptoScanner,
	"totp-simulator": TotpSimulator,
	"image-quiz": ImageQuiz,
	"email-inspector": EmailInspector,
};

export const InteractiveSlide = ({ slide, onNext, onPrevious, canGoPrevious, isCompleted }) => {
	const Component = VARIANTS[slide.variant];

	return (
		<div className="min-h-full flex flex-col p-4 pb-6 sm:p-6 sm:pb-8 md:p-8 md:pb-10 text-center max-w-6xl mx-auto">
			<h2 className="text-2xl sm:text-3xl font-bold text-primary mb-1 sm:mb-2">{slide.title}</h2>
			<p className="text-text-secondary mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base md:text-lg">
				{slide.description}
			</p>

			{Component ? (
				<Component
					onComplete={onNext}
					onPrevious={onPrevious}
					canGoPrevious={canGoPrevious}
					isCompleted={isCompleted}
					data={slide.data}
					labels={slide.labels}
				/>
			) : (
				<div className="p-8 border border-dashed border-error rounded-xl">
					Unknown interactive variant: {slide.variant}
					<button onClick={onNext} className="block mt-4 text-sm underline">
						Skip
					</button>
				</div>
			)}
		</div>
	);
};
