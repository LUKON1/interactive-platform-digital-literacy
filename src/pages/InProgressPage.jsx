import React from "react";
import { Link } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { CyberGridBackground } from "../components/ui/CyberGridBackground";
import { motion } from "motion/react";

export const InProgressPage = () => {
	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden">
			<CyberGridBackground />

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative z-10 p-8 md:p-12 max-w-2xl text-center">
				<div className="mb-6 flex justify-center">
					<div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/30 backdrop-blur-md">
						<Construction size={48} className="text-primary animate-pulse" />
					</div>
				</div>

				<h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary mb-6">
					Страница в разработке
				</h1>

				<p className="text-xl text-text-secondary mb-10 leading-relaxed">
					Мы активно работаем над этим разделом! <br />
					Скоро здесь появится что-то очень крутое и полезное для твоей цифровой безопасности.
				</p>

				<Link
					to="/"
					className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all">
					<ArrowLeft size={20} />
					Вернуться на главную
				</Link>
			</motion.div>
		</div>
	);
};
