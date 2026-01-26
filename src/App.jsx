import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { LibraryPage } from "./pages/LibraryPage";
import { SkillTreePage } from "./pages/SkillTreePage";

import { TopicPage } from "./pages/TopicPage";
import { LessonPage } from "./pages/LessonPage";

import { MainLayout } from "./components/layout/MainLayout";

function App() {
	return (
		<BrowserRouter>
			<MainLayout>
				<Routes>
					<Route path="/" element={<SkillTreePage />} />
					<Route path="/library" element={<LibraryPage />} />
					<Route path="/topic/:id" element={<TopicPage />} />
					<Route path="/topic/:id/lesson/:lessonId" element={<LessonPage />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</MainLayout>
		</BrowserRouter>
	);
}

export default App;
