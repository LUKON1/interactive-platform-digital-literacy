import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CyberGridBackground } from "../ui/CyberGridBackground";

export const MainLayout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col text-text-primary font-body relative z-10">
			<CyberGridBackground />
			<Header />
			<main className="flex-1 w-full max-w-screen overflow-x-hidden">{children}</main>
			<Footer />
		</div>
	);
};
