import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Lazy load pages
const LibraryPage = lazy(() =>
	import("./pages/LibraryPage").then((module) => ({ default: module.LibraryPage })),
);
const SkillTreePage = lazy(() =>
	import("./pages/SkillTreePage").then((module) => ({ default: module.SkillTreePage })),
);
const TopicPage = lazy(() =>
	import("./pages/TopicPage").then((module) => ({ default: module.TopicPage })),
);
const LessonPage = lazy(() =>
	import("./pages/LessonPage").then((module) => ({ default: module.LessonPage })),
);
const InProgressPage = lazy(() =>
	import("./pages/InProgressPage").then((module) => ({ default: module.InProgressPage })),
);
const AboutPage = lazy(() =>
	import("./pages/AboutPage").then((module) => ({ default: module.AboutPage })),
);

import { MainLayout } from "./components/layout/MainLayout";
import { Loader } from "./components/ui/Loader";
import { XpNotification } from "./components/features/gamification/XpNotification";

import { CompletionModal } from "./components/features/gamification/CompletionModal";
import { ProfileModal } from "./components/features/gamification/ProfileModal";

function App() {
	return (
		<BrowserRouter>
			<XpNotification />
			<CompletionModal />
			<ProfileModal />
			<MainLayout>
				<Suspense
					fallback={
						<div className="flex items-center justify-center h-screen">
							<Loader />
						</div>
					}>
					<Routes>
						<Route path="/" element={<SkillTreePage />} />
						<Route path="/library" element={<LibraryPage />} />
						<Route path="/topic/:id" element={<TopicPage />} />
						<Route path="/topic/:id/lesson/:lessonId" element={<LessonPage />} />
						<Route path="/progress" element={<InProgressPage />} />
						<Route path="/about" element={<AboutPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</Suspense>
			</MainLayout>
		</BrowserRouter>
	);
}

export default App;
