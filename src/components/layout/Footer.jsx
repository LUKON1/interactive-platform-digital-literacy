import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "motion/react";

export const Footer = () => {
	const location = useLocation();
	const year = useMemo(() => new Date().getFullYear(), []);

	// Don't show footer inside a lesson
	if (location.pathname.includes("/lesson/")) return null;

	return (
		<footer className="border-t border-bg-surface-3 bg-bg-surface-1 py-12 mt-auto">
			<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
				<div className="col-span-1 md:col-span-2">
					<h3 className="text-lg font-bold text-text-primary mb-4">Cyber Academy</h3>
					<p className="text-text-secondary text-sm max-w-sm leading-relaxed">
						Образовательная платформа для повышения цифровой грамотности школьников. Мы делаем
						интернет безопаснее, один урок за раз.
					</p>
				</div>

				<div>
					<h4 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">
						Платформа
					</h4>
					<ul className="space-y-2 text-sm text-text-secondary">
						<li>
							<Link to="/progress" className="hover:text-primary transition-colors">
								Все курсы
							</Link>
						</li>
						<li>
							<Link to="/progress" className="hover:text-primary transition-colors">
								Рейтинг
							</Link>
						</li>
						<li>
							<Link to="/progress" className="hover:text-primary transition-colors">
								Для учителей
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<h4 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">
						Контакты
					</h4>
					<ul className="space-y-2 text-sm text-text-secondary">
						<li>support@cyberacademy.ru</li>
						<li>+7 (999) 000-00-00</li>
						<li>Москва, Россия</li>
						<li>
							<div className="rainbow-box group">
								<div className="relative block rounded-sm bg-bg-surface-1 px-3 py-1 text-sm">
									<p className="flex items-center gap-1 font-medium">
										<span className="text-text-secondary">Created by</span>
										<a
											className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold hover:brightness-125 transition-all"
											href="https://github.com/LUKON1"
											target="_blank"
											rel="noopener noreferrer">
											LUKON
										</a>
									</p>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-bg-surface-3 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
				<p>© {year} Cyber Academy. Все права защищены.</p>
				<div className="flex gap-6 mt-4 md:mt-0">
					<Link to="/progress" className="hover:text-text-primary">
						Политика конфиденциальности
					</Link>
					<Link to="/progress" className="hover:text-text-primary">
						Условия использования
					</Link>
				</div>
			</div>
		</footer>
	);
};
