import React from "react";
import { LessonNavigation } from "../LessonNavigation";

// Wrapper for backward compatibility with existing interactive components
export const InteractiveNavigation = (props) => {
	return <LessonNavigation {...props} />;
};
