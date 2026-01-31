import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { LessonLayout } from "../components/layout/LessonLayout";
import { LESSONS } from "../data/lessons";
import { useProgressStore } from "../store/useProgressStore";
import { IntroSlide } from "../components/features/lesson-slides/IntroSlide";
import { TheorySlide } from "../components/features/lesson-slides/TheorySlide";
import { FactSlide } from "../components/features/lesson-slides/FactSlide";
import { InteractiveSlide } from "../components/features/lesson-slides/InteractiveSlide";
import { OuttroSlide } from "../components/features/lesson-slides/OuttroSlide";

const SLIDE_COMPONENTS = {
	intro: IntroSlide,
	theory: TheorySlide,
	fact: FactSlide,
	interactive: InteractiveSlide,
	outtro: OuttroSlide,
};

export const LessonPage = () => {
	const { id: topicId, lessonId } = useParams();
	const navigate = useNavigate();
	const { completeLesson } = useProgressStore();

	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const [completedInteractives, setCompletedInteractives] = useState(new Set());

	// Find Lesson Data
	const topicLessons = LESSONS[topicId];
	const lesson = topicLessons?.find((l) => l.id === lessonId);

	useEffect(() => {
		if (!lesson) {
			navigate(`/topic/${topicId}`); // Redirect if invalid
		}
	}, [lesson, topicId, navigate]);

	if (!lesson) return null;

	const slides = lesson.slides || [];

	if (slides.length === 0) {
		return (
			<LessonLayout title={lesson.title} progress={0} onClose={() => navigate(`/topic/${topicId}`)}>
				<div className="h-full flex items-center justify-center flex-col text-center p-8">
					<h2 className="text-2xl font-bold text-text-primary mb-4">Урок в разработке 🛠</h2>
					<p className="text-text-secondary">Мы уже пишем контент. Загляните позже!</p>
				</div>
			</LessonLayout>
		);
	}

	const currentSlide = slides[currentSlideIndex];
	const Progress = ((currentSlideIndex + 1) / slides.length) * 100;

	const handleNext = () => {
		if (currentSlideIndex < slides.length - 1) {
			setCurrentSlideIndex((prev) => prev + 1);
		}
	};

	const handlePrevious = () => {
		if (currentSlideIndex > 0) {
			setCurrentSlideIndex((prev) => prev - 1);
		}
	};

	const handleComplete = () => {
		completeLesson(topicId, lessonId);
	};

	const handleInteractiveComplete = () => {
		// Mark current interactive as completed
		setCompletedInteractives((prev) => new Set([...prev, currentSlideIndex]));
		handleNext();
	};

	if (!currentSlide) return null;

	const SlideComponent = SLIDE_COMPONENTS[currentSlide.type] || TheorySlide;
	const isInteractiveCompleted = completedInteractives.has(currentSlideIndex);

	return (
		<LessonLayout
			title={lesson.title}
			progress={Progress}
			onClose={() => navigate(`/topic/${topicId}`)}>
			<AnimatePresence mode="wait">
				<motion.div
					key={currentSlideIndex}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.3 }}
					className="h-full motion-safe">
					<SlideComponent
						slide={currentSlide}
						onNext={currentSlide.type === "interactive" ? handleInteractiveComplete : handleNext}
						onPrevious={handlePrevious}
						onClose={() => navigate(`/topic/${topicId}`)}
						canGoPrevious={currentSlideIndex > 0}
						isCompleted={isInteractiveCompleted}
						lessonId={lessonId}
						topicId={topicId}
						onComplete={handleComplete}
					/>
				</motion.div>
			</AnimatePresence>
		</LessonLayout>
	);
};
