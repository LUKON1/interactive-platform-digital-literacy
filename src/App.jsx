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

import { MainLayout } from "./components/layout/MainLayout";

function App() {
	return (
		<BrowserRouter>
			<MainLayout>
				<Suspense
					fallback={<div className="flex items-center justify-center h-screen">Загрузка...</div>}>
					<Routes>
						<Route path="/" element={<SkillTreePage />} />
						<Route path="/library" element={<LibraryPage />} />
						<Route path="/topic/:id" element={<TopicPage />} />
						<Route path="/topic/:id/lesson/:lessonId" element={<LessonPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</Suspense>
			</MainLayout>
		</BrowserRouter>
	);
}

export default App;
