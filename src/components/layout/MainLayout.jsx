import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const MainLayout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col bg-[var(--color-bg-base)] text-[var(--color-text-primary)] font-body">
			<Header />
			<main className="flex-1 w-full max-w-[100vw] overflow-x-hidden">{children}</main>
			<Footer />
		</div>
	);
};
